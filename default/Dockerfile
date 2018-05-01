FROM node:%NODE_DOCKER_TAG

# Environment variables
ENV PATH /opt/app/node_modules/.bin:$PATH

# Create app directory
RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install app dependencies
COPY package.json /opt/app/
RUN npm i

# Bundle app package files
COPY . /opt/app
RUN npm i

# Execute service
CMD [ "npm", "start" ]
