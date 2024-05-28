import ballerina/uuid;
import ballerina/http;
import ballerina/jwt;


type EntryPayload record {|
    string username;
    string value;
|};

type Entry record {|
    string value;
    string id;
|};

map<map<Entry>> entries = {};

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"],
        allowCredentials: false,
        allowHeaders: ["CORELATION_ID"],
        exposeHeaders: ["X-CUSTOM-HEADER"],
        maxAge: 84900
    }
}

service / on new http:Listener(9090) {

    resource function get entries(http:Headers headers, string username) returns Entry[]|http:BadRequest|error {
        if (!isValidUser(headers, username)) {
            return <http:BadRequest>{body: {"error": "Invalid user"}};
        }
        map<Entry>|http:BadRequest usersEntries = check getUsersEntries(username);
        if (usersEntries is map<Entry>) {
            return usersEntries.toArray();
        }
        return <http:BadRequest>usersEntries;
    }

    resource function post entries(http:Headers headers,
            @http:Payload EntryPayload newEntry) returns http:Created|http:BadRequest|error {

        if (!isValidUser(headers, newEntry.username)) {
            return <http:BadRequest>{body: {"error": "Invalid user"}};
        }
        string entryId = uuid:createType1AsString();
        map<Entry>|error usersEntries = check getUsersEntries(newEntry.username);
        if (usersEntries is map<Entry>) {
            usersEntries[entryId] = {value: newEntry.value, id: entryId};
            return <http:Created>{};
        }
        return usersEntries;
    }
}

function getUsersEntries(string username) returns map<Entry>|error {
    if (entries[username] is ()) {
        entries[username] = {};
    }
    return <map<Entry>>entries[username];
}

function isValidUser(http:Headers headers, string username) returns boolean {
   string|error jwtAssertion = headers.getHeader("x-jwt-assertion");
   if (jwtAssertion is error) {
       return false;
   }

   [jwt:Header, jwt:Payload]|error decodedJwt = jwt:decode(jwtAssertion);
   if (decodedJwt is error) {
       return false;
   }

   [jwt:Header, jwt:Payload] [_, payload] = decodedJwt;

   if (payload.sub is string && <string>payload.sub == username) {
       return true;
   }

   return false;
}
