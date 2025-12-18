# EEP-OS-Parking-System

## Description
The purpose of this project is to be the software side that manages the carpark system in the parking booth and it is meant to be a local repo that runs at each carpark from handling deduction to be the dashboard that will check what things are going on. We will think of adding a cloud version hosted on something like AWS to probably deal and manage all of the computers remotely.

## Tech Stack

- Frontend: React.js as it has easier routing compared to Next.js as Next.js is also server side rendering. CSS tailwind for styling and UI/UX portion of this.

- Backend: Node.js as it is easier for I/O threading, easy to scaffold and maintain compared to Django as Django comes with "battery packs" like authentication and an admin panel which we will not need. 

- Devops: Circle CI for CI/CD and Docker if there is a need for package management. 

This application will hosted locally on a PC as this will be distributed to the various carparks in Singapore. We will explore a method where all the PCs will be connected centrally to a central operating system where we can change all the functions in the various PMS like holidays by configuring it in the central operating system or the central database for shared information. 

## Setup of repo

We need to install the necessary packages for the frontend and the backend separately. So cd into the frontend, the backend and the middleware folder individually and run this command
```
npm install
```
This will install the necessary packages into your system for you to run the backend and the frontend.

Run the backend and the frontend separately by opening two terminals

```
cd backend
```

```
cd frontend
```

then on the backend run for local development

```
nodemon server.js
```
if nodemon is installed or if it is not installed,

``` 
node server.js
```

For production cases or for setting up the new carpark

```
node monitor-server.js
```

This script will force node to restart and reboot itself every 24 hours for practical purposes to clear memory.

For the frontend, you can run 
```
npm start
``` 

## Overview of backend
The backend comprises of the database that is using MSSQL and three backend modules that is movement_transactions, config and season parking. This is for us to track car movements through our carparks, to CRUD any details in our carpark and to check seasonality parking or CRUD it as well. 

## Overview of frontend
It is a dashboard to see the status of the carpark to see what is going on in the carpark and for the call centre to see the status of the carpark like lot status, entry and exit movement transactions and season holders.  

There are also reports for us to track movements and to see what is going on in the car park through logs and data. This is also important for admin office as they need it for their own reporting and work. 

## Database
Database is hosted on MSSQL and on the cloud so you need the credentials to login which will be given to you when required for cybersecurity purposes if you need it for maintenance or altering some stored procedures in there for instance. Generally it should be able to connect to the database pretty fast, however if there are any issues with connecting with the database, it is possible to check the logs as to what the issue was or check the credentials to see if it was typed wrongly. 

## API-docs
To access the swagger api documentation, you can use this url link

```
http://localhost:5000/api-docs
```

From there you can use it to see how to interface and test the api from TS side so it is easier to know how to do API Integration. 

## Test cases
To ensure that everything is working correctly, ensure that you create test cases for the ones that you are working on. There is both a frontend and backend tests so ensure you cd into the folders before running. 

```
npm test
```

Ensure that the test cases pass first before pushing into the repo and into CI/CD configurations or merging it into master if we are working with various software engineers. Please use feature branching method when you are creating new features or fixing bugs so that when we check it, we can do a trace back of which merge might cause issues if it happens. 

You can refer to the EEP documentation for more of the hardware version as the software part documentations are in here.

## Encryption of env files

To encrypt the env files, we first need to install this dotenvx library

```
npm install @dotenvx/dotenvx
```

Afterwards we need to encrypt both the backend and the frontend env files, we can encrypt all the environment variables except the ones pointing to the frontend and the backend url. So either copy them out and paste them back later or if you have any other solutions, you can do so.

You can run this to encrypt the dotenv files
```
npx dotenvx encrypt
```

Put this inside the package.json file or whatever private key is given after the encryption
```
{
  "scripts": {
    "decryption": "DOTENV_PRIVATE_KEY='821327d6fdecd6fddb7b542f4f7955508b94c3f1448fb57568e39d92a194fe75' dotenvx run -- node app.js"
  }
}
```
To debug issues, see if there is an issue with the backend or server error when you are doing things. If so, it is most likely you also encrypted the frontend and backend urls and you need to write the backend and frontend in plaintext and not in an encrypted format as somehow it cannot read encrypted frontend and backend urls. 

If there are any issues, you can slowly debug it by console logging to see where the issu     e lies.

## Anticipated future improvements

We are anticipating adding logging system and redis caching with various caching strategies to improve the performance of the system. This would also help us to quickly debug issues if anything arises and to alert us of issues that we might not have anticipated naturally, potentially because of edge cases that we might have missed. 

## SFTP Connection

To connect to the system, we use SFTP connection.

Here is how to connect

```
sftp pcsc@10.2.127.179
```

It will prompt you for the password and reach out to the necessary people to get the password to access the system. 

From there you should be able to access the necessary files with regards to EEP DSCRC. This would allow you to update or download any files from the EEP PMS.