"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type User {\n    first_name: String!\n    middle_name: String\n    last_name: String!\n    email: String!\n    username: String!\n    status: String\n    account_status: String!\n    type: String!\n    deleted_status: Boolean!\n    verified: Boolean!\n    verification_code: Int!\n    confirmed: Boolean!\n    id: int!\n  }\n  type Query {\n    auth: User!\n  }\n  type Mutation {\n    register(first_name: String! middle_name: String last_name: String! username: String! email: String! password: String! confirmPassword: String! ) : User!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require("apollo-server"),
    gql = _require.gql; // The GraphQL schema


module.exports = gql(_templateObject());