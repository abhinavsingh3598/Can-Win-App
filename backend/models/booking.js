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
const BookingsTableSchema = new dynamoose.Schema({
  bookingId: { type: String, hashKey: true, required: true, index: true }, // The primary key of the Chat table
  username: { type: String, required: true },
  userEmail: { type: String, required: true },
  city: { type: String, required: true },
  phoneNum: { type: String, required: true },
  location: { type: String, required: true },
  vaccinationName: { type: String, required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true },
},
  {
    saveUnknown: true,
    // Add the tableName option here
    tableName: "BookingsTable"
  });

// Create a Chat model using the schema
const Booking = dynamoose.model("BookingsTable", BookingsTableSchema);

module.exports = Booking;

