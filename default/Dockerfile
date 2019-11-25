############### 1. BASE STAGE ###############
FROM node:FROM node:%NODE_DOCKER_TAG-alpine AS base

RUN apk update
RUN apk --no-cache add -qU dbus

# Environment variables
ENV PATH /opt/app/node_modules/.bin:$PATH

# Create app directory
RUN mkdir -p /opt/app
WORKDIR /opt/app


############### 2. BUILD STAGE ###############
FROM base AS build

# Install app dependencies
COPY package*.json ./
RUN npm set progress=false
RUN npm i --production

# Bundle app package files
COPY . .
RUN npm run clean:build


############### 3. RELEASE STAGE ###############
FROM base AS release

# Copy pre-built code
COPY --from=build /opt/app .

# Execute service
CMD [ "sh", "-c", "MUID=`dbus-uuidgen` ; echo $MUID > /etc/machine-id ; echo $MUID > /var/lib/dbus/machine-id ; service ssh start; npm start" ]
