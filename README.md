**Built upon [node-red-contrib-full-msg-json-schema-validation](https://github.com/oarroyog/node-red-contrib-json-schema), origial readme follows**

This validation node does two more things:

- valid the *entire* object, previously it was only possible to validate a property on the object
- generates documentation of the schema and replaces the info details of the node

Some more details are available in [flow form](https://flowhub.org/f/36690f145d5af6ca).

Also unlike the original, this has only one output instead two. Previously the two outputs where used to diverge messages that where valid those that weren't. Instead this throws an exception that can be caught if validation values. For the author this makes more sense since a validation that fails represents an unknown state of the system, causing failure.

Documentation is created using [jsonschema2md](https://github.com/adobe/jsonschema2md) and stored in the nodes *info* box - **existing content will be replaced**. The intention is to copy&paste the documentation somewhere else but the info box is a good place to put in the first place (alternative would be some debug message).



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