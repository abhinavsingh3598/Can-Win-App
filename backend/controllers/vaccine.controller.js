const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const Booking = require('../models/booking');
const sqs = new AWS.SQS({ region: 'us-east-1' });
const sns = new AWS.SNS({ region: 'us-east-1' });
const Province = require('../models/provincesAndCities');

const loginUser = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Query the database to retrieve the user based on the provided username
    const user = await User.query("username").eq(username).exec();

    // Check if the user exists and the password matches
    if (user && user.length > 0 && user[0].password === password) {
      // Return the user object without the password for security reasons
      const { password, ...userWithoutPassword } = user[0];
      res.status(200).send({ message: "Login successful", user: userWithoutPassword });
    } else {
      res.status(401).send({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to do login", error: error });
  }
};

// user register
const registerUser = async (req, res) => {
  try {
    // Retrieve the user object from the request body
    const user = req.body;

    // Create a new User instance using the user object
    const newUser = new User(user);

    // Save the user object to the DynamoDB table
    const userObj = await newUser.save();

    console.log(userObj);
    // Send the booking details to the SQS queue
    const queueParams = {
      MessageBody: JSON.stringify(userObj),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/041159192901/RegisterQueue'
    };

    await sqs.sendMessage(queueParams).promise();

    // Add the userEmail as a subscriber to the SNS topic
    const subscribeParams = {
      Protocol: 'email',
      TopicArn: 'arn:aws:sns:us-east-1:041159192901:BookingNotification',
      Endpoint: userObj.email
    };
    await sns.subscribe(subscribeParams).promise();

    // Return the saved user object
    res.status(200).send({ message: 'User registered successfully', user: userObj });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to register user', error: error });
  }
};



const bookingVaccine = async (req, res) => {
  try {
    // Retrieve the booking object from the request body
    const booking = req.body;

    console.log(booking);
    const bookingId = uuidv4();

    // Set the generated booking ID in the booking object
    booking.bookingId = bookingId;
    // Create a new Booking instance using the booking object
    const newBooking = new Booking(booking);

    // Save the booking object to the DynamoDB table
    const bookingObj = await newBooking.save();

    // Send the booking details to the SQS queue
    const queueParams = {
      MessageBody: JSON.stringify(bookingObj),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/041159192901/BookingQueue'
    };
    await sqs.sendMessage(queueParams).promise();

    // Prepare the plain text formatted booking details
    const message = `
Vaccine Booking Confirmation

Username: ${bookingObj.username}
Email: ${bookingObj.userEmail}
City: ${bookingObj.city}
Location: ${bookingObj.location}
Vaccine Name: ${bookingObj.vaccinationName}
Date: ${bookingObj.date}
Phone Number: ${bookingObj.phoneNum}
Slot: ${bookingObj.slot}
Booking ID: ${bookingObj.bookingId}
        `;

    // Publish the booking details to the subscribed user's email
    const publishParams = {
      Message: message,
      Subject: 'Vaccine Booking Confirmation',
      TopicArn: 'arn:aws:sns:us-east-1:041159192901:BookingNotification',
    };
    await sns.publish(publishParams).promise();

    // Return the saved booking object
    res.status(200).send({ message: 'Booking successfully created', booking: bookingObj });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to book vaccine', error: error });
  }
};


const applicationStatsBooking = async (req, res) => {
  try {
    const queueUrl = 'https://sqs.us-east-1.amazonaws.com/041159192901/BookingQueue';

    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10 // Fetch a maximum of 10 messages at a time
    };

    const bookings = [];

    let data;
    do {
      data = await sqs.receiveMessage(receiveParams).promise();

      // Check if any messages were received
      if (data.Messages && data.Messages.length > 0) {
        // Process each message and extract the booking information
        data.Messages.forEach(message => {
          const booking = JSON.parse(message.Body);
          bookings.push(booking);

          // Delete the message from the queue
          const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams).promise();
        });
      }

      // Continue fetching messages if there are more available
      receiveParams.NextToken = data.NextToken;
    } while (data.Messages && data.Messages.length > 0);

    res.status(200).send({ message: 'Booking information retrieved', bookings });
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch the booking information', error });
  }
};

const applicationStatsUsers = async (req, res) => {
  try {
    const queueUrl = 'https://sqs.us-east-1.amazonaws.com/041159192901/RegisterQueue';

    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10 // Fetch a maximum of 10 messages at a time
    };

    const users = [];

    let data;
    do {
      data = await sqs.receiveMessage(receiveParams).promise();

      // Check if any messages were received
      if (data.Messages && data.Messages.length > 0) {
        // Process each message and extract the user information
        data.Messages.forEach(message => {
          const user = JSON.parse(message.Body);
          users.push(user);

          // Delete the message from the queue
          const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams).promise();
        });
      }

      // Continue fetching messages if there are more available
      receiveParams.NextToken = data.NextToken;
    } while (data.Messages && data.Messages.length > 0);

    res.status(200).send({ message: 'User information retrieved', users });
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch the user information', error });
  }
};


const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.scan().exec();

    // Map provinces to get only the province names and cases
    const provinceData = provinces.map(province => ({ name: province.province, activeCases: province.cases }));

    res.status(200).send({ message: 'Provinces retrieved', provinces: provinceData });
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve the provinces', error });
  }
};


const getProvince = async (req, res) => {
  try {
    const provinceName = req.params.name;

    if (!provinceName) {
      res.status(400).send({ message: 'Province name is missing in the request' });
      return;
    }

    const province = await Province.query('province').eq(provinceName).exec();

    if (province.length > 0) {
      const { cities, cases } = province[0]; // include cases here

      const provinceDetails = {
        name: provinceName,
        cases, // add cases to provinceDetails
        cities: cities
      };

      res.status(200).send({ message: 'Province details retrieved', province: provinceDetails });
    } else {
      res.status(404).send({ message: 'Province not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve the province details', error });
  }
};


const updateSlot = async (req, res) => {
  try {
    const { provinceName, time } = req.body; // Assuming you're sending the province name in the body of the request
    const cityName = req.params.cityName; // Assuming you're sending the city name as a path parameter

    // Find the province
    const province = await Province.get(provinceName);

    // Find the city within the province
    const city = province.cities.find(city => city.name === cityName);

    // If city not found, return error
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Find the slot within the city
    const slot = city.slots.find(slot => slot.time === time);

    // If slot not found, return error
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // If slot is not available, return error
    if (!slot.available) {
      return res.status(400).json({ message: 'Slot is not available' });
    }

    // Update the slot
    slot.available = false;

    // Save the updated province
    await Province.update(province);

    res.status(200).json({ message: 'Slot updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update slot', error });
  }
};

module.exports = {
  loginUser, registerUser, bookingVaccine, applicationStatsBooking, applicationStatsUsers, getProvince, getAllProvinces, updateSlot
};