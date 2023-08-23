const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const tableName1 = process.env.tableName1;
const tableName2 = process.env.tableName2; // Let's assume you pass the user table name as another environment variable


const provinceData = {
  "provinces": [
    {
      "name": "Nova Scotia",
      "cases":"20000",
      "cities": [
        {
          
          "name": "Halifax",
          "locationaddress": "123 Street, Halifax",
          "vaccineName": 'Pfizer',
          "slots": [
            { "time": "9:00 AM - 10:00 AM", "available": true },
            { "time": "11:00 AM - 12:00 PM", "available": false },
            { "time": "2:00 PM - 3:00 PM", "available": true }
          ]
        },
        {
          "name": "Bedford",
          "locationaddress": "456 Street, Bedford",
          "vaccineName": 'Moderna',
          "slots": [
            { "time": "10:00 AM - 11:00 AM", "available": true },
            { "time": "12:00 PM - 1:00 PM", "available": true },
            { "time": "3:00 PM - 4:00 PM", "available": false }
          ]
        }
      ]
    },
    {
      "name": "Ontario",
      "cases":"110000",
      "cities": [
        {
          "name": "Toronto",
          "locationaddress": "789 Street, Toronto",
          "vaccineName": 'Covaxine',
          "slots": [
            { "time": "8:00 AM - 9:00 AM", "available": true },
            { "time": "10:00 AM - 11:00 AM", "available": true },
            { "time": "1:00 PM - 2:00 PM", "available": true }
          ]
        },
        {
          "name": "Ottawa",
          "locationaddress": "987 Street, Ottawa",
          "vaccineName": 'Pfizer',
          "slots": [
            { "time": "9:00 AM - 10:00 AM", "available": false },
            { "time": "11:00 AM - 12:00 PM", "available": false },
            { "time": "3:00 PM - 4:00 PM", "available": true }
          ]
        }
      ]
    },
    {
      "name": "Alberta",
      "cases":"10000",
      "cities": [
        {
          "name": "Calgary",
          "locationaddress": "654 Street, Calgary",
          "vaccineName": 'Moderna',
          "slots": [
            { "time": "10:00 AM - 11:00 AM", "available": true },
            { "time": "12:00 PM - 1:00 PM", "available": false },
            { "time": "4:00 PM - 5:00 PM", "available": true }
          ]
        }
      ]
    },
    {
      "name": "British Columbia",
      "cases":"70000",
      "cities": [
        {
          "name": "Surrey",
          "locationaddress": "321 Street, Surrey",
          "vaccineName": 'Pfizer',
          "slots": [
            { "time": "8:00 AM - 9:00 AM", "available": true },
            { "time": "10:00 AM - 11:00 AM", "available": true },
            { "time": "2:00 PM - 3:00 PM", "available": false }
          ]
        },
        {
          "name": "Vancouver",
          "locationaddress": "555 Street, Vancouver",
          "vaccineName": 'Covex',
          "slots": [
            { "time": "9:00 AM - 10:00 AM", "available": true },
            { "time": "11:00 AM - 12:00 PM", "available": true },
            { "time": "1:00 PM - 2:00 PM", "available": true }
          ]
        }
      ]
    }
  ]
};


const userData = [
  {
    "username": "sayan123",
    "email": "abhinav.singh@dal.ca",
    "firstName": "sayan",
    "lastName": "sharma",
    "password": "user123",
    "phoneNum": "1234567890",
    "profilePic": "profile.jpg",
    "role": "user"
  },
  {
    "username": "abhinav123",
    "email": "abhinavsingh.dal@gmail.com",
    "firstName": "Abhinav",
    "lastName": "Singh",
    "password": "admin123",
    "phoneNum": "1234567890",
    "role": "admin"
  }
]

// ... Rest of your data and provinces function ...

const insertData = async (event, context) => {
  try {
      // Map the array of provinces to an array of promises
      const promises = provinceData.provinces.map(province => {
          const params = {
              TableName: tableName1,
              Item: {
                  "province": province.name,
                  "cases":province.cases,
                  "cities": province.cities.map(city => ({
                      "name": city.name,
                      "locationaddress": city.locationaddress,
                      "vaccineName":city.vaccineName,
                      "slots": city.slots
                  }))
              }
          };

          // Return a promise for each put operation
          return new Promise((resolve, reject) => {
              docClient.put(params, (err, data) => {
                  if (err) {
                      console.error('Error inserting item:', err);
                      reject(err);
                  } else {
                      console.log('Item inserted successfully:', data);
                      resolve(data);
                  }
              });
          });
      });

      // Insert users data to DynamoDB
      const userPromises = userData.map(user => {
        const params = {
            TableName: tableName2,
            Item: user
        };

        return new Promise((resolve, reject) => {
            docClient.put(params, (err, data) => {
                if (err) {
                    console.error('Error inserting user data:', err);
                    reject(err);
                } else {
                    console.log('User data inserted successfully:', data);
                    resolve(data);
                }
            });
        });
      });

      // Wait for all promises to resolve
      await Promise.all([...promises, ...userPromises]);

      console.log('Data insertion completed.');
      return { statusCode: 200, body: 'Data insertion completed.' };
  } catch (error) {
      console.error('Error inserting data:', error);
      return { statusCode: 500, body: 'Error inserting data: ' + error };
  }
};


exports.insertData = insertData;





