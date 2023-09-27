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

        var ajv = new Ajv({
            allErrors: true,
            messages: true,
            allowUnionTypes: true
        });

        node.on('input', function (msg, send, done) {
            try {
                var schema = typeof node.func === 'string' && node.func.trim().length ? JSON.parse(node.func) : typeof msg.schema === 'string' ? JSON.parse(msg.schema) : msg.schema;                
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

                if (node.checkentireobject) {
                    var obj = msg;

                    switch (node.propertyType) {
                        case "env":    obj = process.env;           break;
                        case "msg":    obj = msg;                   break;
                        case 'flow':   obj = node.context().flow;   break;
                        case 'global': obj = node.context().global; break;
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
};


/*
[
    {
        "id": "57b346100c086dbe",
        "type": "comment",
        "z": "a7a81bcd7159a826",
        "name": "Hello WOcl",
        "info": "Hello whdsad\nsadasd\na\nsadasdasdasd\n\n\nthis is a commot.",
        "x": 1646,
        "y": 577,
        "wires": []
    }
]
*/