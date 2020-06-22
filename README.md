# **nodeAPI**

Node API which uses MongoDB(Remote) to save data.

This NodeJS API uses JWT(JSON based Token) to secure API.

------------
**Create a DB in MongoDB named "billingSystem"**
------------

Requirements: NPM, NODE

After cloning, install dependencies by running, npm install

To run, 
**npm run dev** (development environment) or **nodemon start** (auto restarts API after every change). 
**npm run** (production environment)

**Insert roles:** 
1. Open terminal and access mongoDB.
2. Use database 
  - use erp;
3. Insert roles
  db.roles.insertMany([{ role: "Admin", code: "admin" },{ role: "Super Admin", code: "super_admin" },{ role: "user", code: "user" }])

**Add user:** 
To add Super User, add superAdmin value which is in config.json in request as pw.
example:

**URL:** localhost:4044/users/register 
**Request:** POST 
**Body:** 
{ 
"lastName": "Admin", 
"firstName": "Super", 
"password": "sadmin", 
"username": "sadmin", 
"email":"sadmin@sgmail.com", 
"pw":"pasdn389asd*h&h9hJWU8"
}

For normal user, remove pw field from the request body.
