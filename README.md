# nodeAPI
Node API which uses MongoDB(Remote) to save data.

This NodeJS API uses JWT(JSON based Token) to secure API.

_____________________

Create a DB in MongoDB named "billingSystem"

Requirements:
NPM, NODE

After cloning, install dependencies by running,
  npm install

To run,
  npm run dev (development environment) or nodemon start (auto restarts API after every change).
  num run (production environment)


Insert roles
db.roles.insertMany([{ role: "Admin", code: "admin" },{ role: "Super Admin", code: "super_admin" },{ role: "user", code: "user" }])

Add user:
To add Super User, add superAdmin value which is in config.json in request as pw.
example:

URL: localhost:4044/users/register
Request: POST
Body:
{
  "lastName": "a",
  "firstName": "a",
  "password": "a",
  "username": "azas",
  "email":"azas@sgmail.com",
  "pw":"pasdn389asd*h&h9hJWU8"
}

For normal user, remove pw field from the request body.
