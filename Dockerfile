#FROM node:14.4.0
#
#WORKDIR /NodeAPI
#
#COPY package*.json ./
#
#RUN npm install && npm install pm2 -g
#
#EXPOSE 4044
#
#CMD ["npm", "start"]

# Create image based on the official Node 6 image from the dockerhub
FROM node:14-alpine

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies
RUN npm install && npm install pm2 -g

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 4044

# Serve the app
CMD [ "pm2-runtime", "npm", "--", "start" ]
