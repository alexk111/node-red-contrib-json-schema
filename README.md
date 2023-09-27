**Built upon [node-red-contrib-full-msg-json-schema-validation](https://github.com/oarroyog/node-red-contrib-json-schema)**

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