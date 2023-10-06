module.exports = function (RED) {
    "use strict";
    function JsonSchemaValidator(n) {
        RED.nodes.createNode(this, n);
        this.func = n.func;
        this.name = n.name;
        this.property = n.property;
        this.propertyType = n.propertyType;
        this.checkentireobject = n.checkentireobject;

        var node = this;

        var process = require('process');
        var Ajv = require('ajv');


        node.on('input', function (msg, send, done) {
            try {
                var schema = typeof node.func === 'string' && node.func.trim().length ? JSON.parse(node.func) : typeof msg.schema === 'string' ? JSON.parse(msg.schema) : msg.schema;                

                var ajv = new Ajv({
                    allErrors: true,
                    messages: true,
                    allowUnionTypes: true
                });

                var validate = ajv.compile(schema);

                var runValidate = (prop) => {
                    var valid = validate(prop);

                    if (!valid) {
                        msg['error'] = validate.errors;
                        done("validation errors", msg)
                    }
                    else {
                        delete msg.schema;
                        send(msg);
                        done()
                    }
                };

                if (node.checkentireobject || node.propertyType.startsWith("full") ) {
                    var obj = msg;

                    var flowOrGlobalToHash = (ste) => {
                        var rVal = {};

                        ste.keys().forEach((nme) => {
                            rVal[nme] = ste.get(nme)
                        })

                        return rVal;
                    }

                    switch (node.propertyType) {
                        case "env":    
                        case "fullenv":    
                            obj = process.env;  
                            break;
                            
                        case "msg":    
                        case "fullmsg":    
                            obj = msg;          
                            break;

                        case 'flow':   
                        case 'fullflow':   
                            obj = flowOrGlobalToHash(node.context().flow);   
                            break;

                        case 'global': 
                        case 'fullglobal': 
                            obj = flowOrGlobalToHash(node.context().global); 
                            break;

                        default:
                            done("unknown property type '" + node.propertyType + "' to be check entirely.", msg);
                            return;
                    }

                    runValidate(obj)
                } else {
                    var prop = RED.util.evaluateNodeProperty(node.property, node.propertyType, node, msg);

                    if (prop !== undefined) {
                        runValidate(prop)
                    } else {
                        done("prop undefined", msg)
                    }
                }
            } catch (err) {
                done("failed to scan schema", msg);
            }
        });
    }
    RED.nodes.registerType("JsonSchemaValidatorWithDocu", JsonSchemaValidator);

    RED.httpAdmin.post("/JsonSchemaValidatorWithDocu/:id",
        RED.auth.needsPermission("JsonSchemaValidatorWithDocu.write"),
        (req, res) => {
            var node = RED.nodes.getNode(req.params.id);
            if (node != null) {
                try {
                    if (req.body && node.type == "JsonSchemaValidatorWithDocu") {
                        import('@adobe/jsonschema2md').then( (module) => {
                            const markdown = module.jsonschema2md(req.body, {
                                includeReadme: false,
                            });

                            res.status(200).send({
                                md: markdown
                            })
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send(err.toString());
                            node.error("SchemaDocu: Submission failed: " +
                                err.toString())
                        })                    
                    } else {
                        res.sendStatus(404);
                    }
                } catch (err) {
                    console.error(err);
                    res.status(500).send(err.toString());
                    node.error("JsonSchemaValid: Submission failed: " +
                        err.toString())
                }
            } else {
                res.sendStatus(404);
            }
        });
};
