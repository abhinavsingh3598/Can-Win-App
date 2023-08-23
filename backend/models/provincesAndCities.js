const dynamoose = require("dynamoose");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const AWS = require("aws-sdk");
require("dotenv").config();

const dynamodb = new DynamoDB({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    sessionToken: process.env.sessionToken
  }
});

dynamoose.aws.sdk = dynamodb;

const SlotSchema = new dynamoose.Schema({
    time: String,
    
    available: Boolean
}, {saveUnknown: true});

const CitySchema = new dynamoose.Schema({
    name: String,
    vaccineName:String,
    locationaddress: String,
    slots: {
        type: Array,
        schema: [SlotSchema]
    }
}, {saveUnknown: true});

const ProvincesTableSchema = new dynamoose.Schema({
    province: {
        type: String,
        hashKey: true
    },
    cases:{type: String},
    cities: {
        type: Array,
        schema: [CitySchema]
    }
},   {
    saveUnknown: true,
    // Add the tableName option here
    tableName: "ProvincesTable"
  });

const Province = dynamoose.model("ProvincesTable", ProvincesTableSchema);

module.exports = Province;