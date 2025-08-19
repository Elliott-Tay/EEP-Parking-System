# EEP-OS-Parking-System

## Description
The purpose of this project is to be the software side that manages the carpark system in the parking booth and it is meant to be a local repo that runs at each carpark from handling deduction to be the dashboard that will check what things are going on. We will think of adding a cloud version hosted on something like AWS to probably deal and manage all of the computers remotely.

## Tech Stack

- Frontend: React.js as it has easier routing compared to Next.js as Next.js is also server side rendering. CSS tailwind for styling and UI/UX portion of this.

- Backend: Node.js as it is easier for I/O threading, easy to scaffold and maintain compared to Django as Django comes with "battery packs" like authentication and an admin panel which we will not need. 

## Setup of repo

We need to install the necessary packages for the frontend and the backend separately. So cd into the frontend and the backend folder individually and run this command
```
npm install
```
This will install the necessary packages into your system for you to run the backend and the frontend.

To create your database with the necessary schema in it, you can run this SQL command
```
-- 1. Create the database
CREATE DATABASE IF NOT EXISTS EEP;

-- 2. Use the database
USE EEP;

-- 3. Create the table for movement transactions
CREATE TABLE IF NOT EXISTS movement_transactions (
    IU_no VARCHAR(50) NOT NULL PRIMARY KEY,   -- IU
    vehicle_type VARCHAR(30) NOT NULL,           -- Vehicle Type
    holder_name VARCHAR(100) NOT NULL,           -- Holder Name
    entry_time DATETIME NOT NULL,                -- Entry Time
    exit_time DATETIME DEFAULT NULL,             -- Exit Time (can be NULL if still parked)
    parked_time TIME GENERATED ALWAYS AS (TIMEDIFF(exit_time, entry_time)) STORED, -- Parked Time in HH:MM:SS
    paid_amount DECIMAL(10,2) DEFAULT 0.00,     -- Paid Amount
    card_type VARCHAR(50),                       -- Card Type
    card_no VARCHAR(50),                         -- Card No
    vehicle_no VARCHAR(20) NOT NULL              -- Vehicle Number
);
```

## Test cases
To ensure that everything is working correctly, ensure that you create test cases for the ones that you are working on. There is both a frontend and backend tests so ensure you cd into the folders before running. 

```
npm test
```

Ensure that the test cases pass first before pushing into the repo and into CI/CD configurations.