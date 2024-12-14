module.exports = function (RED) {
    "use strict";
    function JsonSchemaValidator(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.property = n.property;
        this.propertyType = n.propertyType;
        this.checkentireobject = n.checkentireobject;

        var node = this;

        var process = require('process');
        var Ajv = require('ajv');


        node.on('input', function (msg, send, done) {
            try {
                var schema = typeof msg.schema === 'string' ? JSON.parse(msg.schema) : msg.schema;

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
                msg.error = err
                done("failed to scan schema", msg);
            }
        });
    }
    RED.nodes.registerType("JsonSchemaValidatorWithDocu", JsonSchemaValidator);

};
