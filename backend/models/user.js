const dynamoose = require("dynamoose");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
// Initialize a DynamoDB client instance
const dynamodb = new DynamoDB({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    sessionToken: process.env.sessionToken
  }
});
dynamoose.aws.sdk = dynamodb;

// Define a schema for chat messages
const UsersTableSchema = new dynamoose.Schema({
  username: { type: String, hashKey: true, required: true, index: true }, // The primary key of the Chat table
  password: { type: String, required: true }, 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: false },
  email: { type: String, required: true },
  phoneNum: { type: String, required: true }, 
  profilePic: { type: String, required: false },
},
{
  saveUnknown: true,
  // Add the tableName option here
  tableName: "UsersTable"
});

// Create a Chat model using the schema
const User = dynamoose.model("UsersTable", UsersTableSchema);

module.exports = User;

  