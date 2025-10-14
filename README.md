# EEP-OS-Parking-System

## Description
The purpose of this project is to be the software side that manages the carpark system in the parking booth and it is meant to be a local repo that runs at each carpark from handling deduction to be the dashboard that will check what things are going on. We will think of adding a cloud version hosted on something like AWS to probably deal and manage all of the computers remotely.

## Tech Stack

- Frontend: React.js as it has easier routing compared to Next.js as Next.js is also server side rendering. CSS tailwind for styling and UI/UX portion of this.

- Backend: Node.js as it is easier for I/O threading, easy to scaffold and maintain compared to Django as Django comes with "battery packs" like authentication and an admin panel which we will not need. 

- Devops: Circle CI for CI/CD and Docker if there is a need for package management. 

This application will hosted locally on a PC as this will be distributed to the various carparks in Singapore. We will explore a method where all the PCs will be connected centrally to a central operating system where we can change all the functions in the various PMS like holidays by configuring it in the central operating system. 

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

then on the backend run

```
nodemon server.js
```
if nodemon is installed or if it is not installed,

``` 
node server.js
```

For the frontend, you can run 
```
npm start
``` 

## Overview of backend
The backend comprises of the database that is using MySQL and three backend modules that is movement_transactions, config and season parking. This is for us to track car movements through our carparks, to CRUD any details in our carpark and to check seasonality parking or CRUD it as well. 

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

Ensure that the test cases pass first before pushing into the repo and into CI/CD configurations or merging it into master if we are working with various software engineers. Please use feature branching method when 