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

1. Movement_transactions table
```
CREATE TABLE movement_transactions (
    log_id INT AUTO_INCREMENT PRIMARY KEY,           -- Unique identifier for each transaction

    vehicle_id VARCHAR(50) NOT NULL,                -- IU No / OBU No / Card No

    entry_trans_type INT NOT NULL,                  -- Foreign key to TransTypeMaster.log_id
    entry_station_id INT NOT NULL,                  -- Foreign key to StationInfoMaster.station_id
    entry_datetime DATETIME NOT NULL,              
    entry_datetime_detect DATETIME NULL,           

    exit_trans_type INT NULL,                       -- Foreign key to TransTypeMaster.log_id
    exit_station_id INT NULL,                       -- Foreign key to StationInfoMaster.station_id
    exit_datetime DATETIME NULL,                   
    exit_datetime_detect DATETIME NULL,            

    parking_duration INT NULL,                      -- Duration in minutes
    parking_charges DECIMAL(10,2) NULL,           
    paid_amount DECIMAL(10,2) NULL,               

    card_type INT NULL,                             -- Foreign key to CardTypeMaster.card_id
    card_number VARCHAR(50) NULL,                 

    vehicle_number VARCHAR(20) NULL,              
    ticket_type INT NULL,                          -- Just store, no FK
    ticket_id INT UNIQUE,                           -- Foreign key to TicketMaster.ticket_id

    update_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    receipt_bit BIT NOT NULL DEFAULT 0,           

    -- Foreign key constraints
    CONSTRAINT FK_MovementTrans_EntryTransType 
        FOREIGN KEY (entry_trans_type) REFERENCES TransTypeMaster(log_id),
    CONSTRAINT FK_MovementTrans_ExitTransType 
        FOREIGN KEY (exit_trans_type) REFERENCES TransTypeMaster(log_id),
    CONSTRAINT FK_MovementTrans_EntryStation 
        FOREIGN KEY (entry_station_id) REFERENCES StationInfoMaster(station_id),
    CONSTRAINT FK_MovementTrans_ExitStation 
        FOREIGN KEY (exit_station_id) REFERENCES StationInfoMaster(station_id),
    CONSTRAINT FK_MovementTrans_CardType 
        FOREIGN KEY (card_type) REFERENCES CardTypeMaster(card_id),
    CONSTRAINT FK_MovementTrans_TicketId 
        FOREIGN KEY (ticket_id) REFERENCES TicketMaster(ticket_id)
);

```

2. Card Type
```
CREATE TABLE CardTypeMaster (
    card_id INT PRIMARY KEY AUTO_INCREMENT,
    card_desc VARCHAR(50) NOT NULL COMMENT 'Debit/Credit Card',
    status BIT NOT NULL DEFAULT 1,
    updated_by SMALLINT NULL,
    updated_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CardTypeHistory (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    card_desc VARCHAR(50) NOT NULL,
    status BIT NOT NULL DEFAULT 1,
    updated_by SMALLINT NULL,
    updated_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_type TINYINT NOT NULL COMMENT '0 - add, 1 - update, 2 - delete',
    
    CONSTRAINT FK_CardTypeHistory_Master FOREIGN KEY (card_id)
        REFERENCES CardTypeMaster(card_id)
);
```

3. TicketMaster
```
CREATE TABLE TicketMaster (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_type TINYINT NOT NULL,  -- References TicketTypeMaster(log_id)
    ticket_no VARCHAR(50) NOT NULL, -- Ticket number
    valid_datetime DATETIME NOT NULL,
    expire_datetime DATETIME NOT NULL,
    redeem_time INT NULL,           -- e.g., duration or usage count
    redeem_amount DECIMAL(10,2) NULL, -- Amount in S$
    printed_station TINYINT NULL,   -- References StationInfoMaster(station_id)
    printed_by SMALLINT NULL,       -- User who printed
    printed_datetime DATETIME NULL,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0 - not used, 1 - used, 2 - expired/not valid',

    -- Foreign Key Constraints
    CONSTRAINT FK_TicketMaster_Type FOREIGN KEY (ticket_type)
        REFERENCES TicketTypeMaster(log_id),

    CONSTRAINT FK_TicketMaster_Station FOREIGN KEY (printed_station)
        REFERENCES StationInfoMaster(station_id)
);
```

4. TicketTypeMaster
```
CREATE TABLE TicketTypeMaster (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_type_desc VARCHAR(50) NOT NULL COMMENT 'Seasonal/Redemption',
    status BIT NOT NULL DEFAULT 1,
    updated_by SMALLINT NULL,
    updated_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TicketTypeHistory (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    ticket_type_desc VARCHAR(50) NOT NULL,
    status BIT NOT NULL DEFAULT 1,
    updated_by SMALLINT NULL,
    updated_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_type TINYINT NOT NULL COMMENT '0 - add, 1 - update, 2 - delete',

    CONSTRAINT FK_TicketTypeHistory_Master FOREIGN KEY (ticket_id)
        REFERENCES TicketTypeMaster(log_id)
);
```

5. Transaction Type
```
CREATE TABLE TransTypeMaster (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    trans_desc VARCHAR(100) NOT NULL COMMENT 'Season / Hourly',
    status BIT NOT NULL DEFAULT 1,
    updated_by SMALLINT NULL,
    updated_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TransTypeHistory (
    log_id INT,
    trans_desc VARCHAR(100) NOT NULL,
    status BIT NOT NULL DEFAULT 1,
    updated_by SMALLINT NULL,
    updated_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_type TINYINT NOT NULL COMMENT '0 - add, 1 - update, 2 - delete',
    
    PRIMARY KEY (log_id, updated_datetime)
);
```

6. StationInfo
```
-- Create StationInfoMaster without foreign key first
CREATE TABLE StationInfoMaster (
    station_id INT PRIMARY KEY AUTO_INCREMENT,
    station_type TINYINT NOT NULL COMMENT '1 - Entry, 2 - Exit, 3 - Entry / Exit',
    station_desc VARCHAR(100) NOT NULL,
    station_ipaddress VARCHAR(50) NULL,
    zone_id TINYINT NULL,        -- will link to ZoneTableMaster later
    status BIT NOT NULL DEFAULT 1,
    update_by SMALLINT NULL,
    update_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Later, after creating ZoneTableMaster
ALTER TABLE StationInfoMaster
ADD CONSTRAINT FK_Station_Zone FOREIGN KEY (zone_id)
REFERENCES ZoneTableMaster(ZONE_ID);

CREATE TABLE StationInfoHistory (
    station_id INT NOT NULL,
    station_type TINYINT NOT NULL,
    station_desc VARCHAR(100) NOT NULL,
    station_ipaddress VARCHAR(50) NULL,
    zone_id TINYINT NULL,        -- will link to ZoneTableHistory later
    status BIT NOT NULL DEFAULT 1,
    update_by SMALLINT NULL,
    update_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_type TINYINT NOT NULL COMMENT '0 - add, 1 - update, 2 - delete',
    PRIMARY KEY (station_id, update_datetime) -- or another composite key if needed
);

-- Later, add FK to ZoneTableHistory
ALTER TABLE StationInfoHistory
ADD CONSTRAINT FK_StationHistory_Zone FOREIGN KEY (zone_id)
REFERENCES ZoneTableHistory(ZONE_ID);
```

7. Zone Table
```
CREATE TABLE ZoneTableMaster (
    zone_id TINYINT PRIMARY KEY AUTO_INCREMENT,  -- Unique ID for the zone
    zone_name VARCHAR(50) NOT NULL,              -- Name of the zone, e.g., "Zone A"
    zone_desc TEXT NULL,                          -- Optional description
    status BIT NOT NULL DEFAULT 1,               -- Active/Inactive: 1 = active, 0 = inactive
    update_by SMALLINT NULL,                     -- User who last updated
    update_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Last update timestamp
);

CREATE TABLE ZoneTableHistory (
    log_id INT PRIMARY KEY AUTO_INCREMENT,       -- Unique log entry
    zone_id TINYINT NOT NULL,                     -- ID of the zone (foreign key from ZoneTableMaster)
    zone_name VARCHAR(50) NOT NULL,              -- Name of the zone at the time of change
    zone_desc TEXT NULL,                          -- Description of the zone at the time of change
    status BIT NOT NULL,                          -- Status at the time of change (1 = active, 0 = inactive)
    update_by SMALLINT NULL,                      -- User who made the change
    update_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- When the change occurred
    record_type TINYINT NOT NULL,                -- 0 = add, 1 = update, 2 = delete
    CONSTRAINT FK_ZoneHistory_ZoneMaster FOREIGN KEY (zone_id)
        REFERENCES ZoneTableMaster(zone_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

## Test cases
To ensure that everything is working correctly, ensure that you create test cases for the ones that you are working on. There is both a frontend and backend tests so ensure you cd into the folders before running. 

```
npm test
```

Ensure that the test cases pass first before pushing into the repo and into CI/CD configurations.