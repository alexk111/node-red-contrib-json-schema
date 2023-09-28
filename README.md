**Built upon [node-red-contrib-full-msg-json-schema-validation](https://github.com/oarroyog/node-red-contrib-json-schema), origial readme follows**

This validation node does two more things:

- valid the *entire* object, previously it was only possible to validate a property on the object
- generates documentation of the schema and replaces the info details of the node with the documentation

Some more details are available in [flow](https://flowhub.org/f/36690f145d5af6ca) that maintains this package.

Unlike the original, instead of two outputs this has only one. Previously the two outputs where used to diverge messages that where valid and those that weren't. Instead this throws an exception that can be caught if validation fails. For the author this makes more sense since a validation that fails represents an unknown state of the system, likely to cause failure - fail fast, fail early is the motto.

Documentation is created using [jsonschema2md](https://github.com/adobe/jsonschema2md) and stored in the nodes *info* box - **existing content will be replaced**. The intention is to copy and paste that documentation to somewhere else. The info box is a good place to put it in the first place, alternative would be a debug message of some sort.

To generate the documentation, use the button in the property panel:

![img](https://cdn.openmindmap.org/content/1695920371650_Screen_Shot_2023-09-28_at_18.58.34.png)

The schema can be pasted into the editor pane also located in the property panel:

![img](https://cdn.openmindmap.org/content/1695920460280_Screen_Shot_2023-09-28_at_19.00.38.png)

An example flow is included and can also be viewed [here](https://flowhub.org/f/f21aed28a04a7fd0).

## Validation methods

As with the original, validation is done using the [ajv](https://www.npmjs.com/package/ajv) library, just an updated version.

Validation of `flow` and `global` is perhaps not the best since it makes a copy of [those two](https://github.com/gorenje/node-red-contrib-json-schema/blob/b648c215a79ca07c0df9ec0b1e4d92e579188dd5/schema.js#L44-L58). The environment is validating using [`process.env`](https://github.com/gorenje/node-red-contrib-json-schema/blob/b648c215a79ca07c0df9ec0b1e4d92e579188dd5/schema.js#L55) - this too might not be the best way.

---

# node-red-contrib-json-full-schema-validator
JSON Full Schema validator for Node Red is pretty easy to use.
Just open node properties and choose which property object wants to validate and paste JSON Schema
- OK will returned in first response
- KO will returned in second response. Error object with explanation will added in msg

**JSON Schema:**

{
  "title": "Person",
  "type": "object",
  "required":["lastName"],
  "properties": {
    "firstName": {
      "type": "string",
      "description": "The person's first name."
    },
    "lastName": {
      "type": "string",
      "description": "The person's last name."
    },
    "age": {
      "description": "Age in years which must be equal to or greater than zero.",
      "type": "integer",
      "minimum": 0
    }
  }
}

Examples:
- OK 
msg.payload= 
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 1
};

- KO
msg.payload= 
{
  "firstName": "John",
  "age": 1
};