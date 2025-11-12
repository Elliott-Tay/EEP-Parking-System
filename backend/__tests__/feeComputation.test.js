// 1. Setup Mocking for Calculator Dependencies
// Mock the external modules containing the calculator classes
const mockComputeFee1 = jest.fn().mockReturnValue(10.50);
const mockComputeFee2 = jest.fn().mockReturnValue(20.00);
const mockComputeFee3 = jest.fn().mockReturnValue(0.00);

jest.mock('../routes/parkingFeeCompute1', () => ({
    ParkingFeeComputer: jest.fn(() => ({
        computeParkingFee: mockComputeFee1,
    })),
}));

jest.mock('../routes/parkingFeeCompute2', () => ({
    ParkingFeeComputer2: jest.fn(() => ({
        computeParkingFee: mockComputeFee2,
    })),
}));

jest.mock('../routes/parkingFeeCompute3', () => ({
    ParkingFeeComputer3: jest.fn(() => ({
        computeParkingFee: mockComputeFee3,
    })),
}));


const request = require('supertest');
const express = require('express');

// Import the router setup provided in the prompt
const router = require('../routes/feeComputation'); // Assuming the file is saved as parkingFeeRoute.js

// Create a minimal Express app to attach the router for testing
const app = express();
app.use(express.json()); // Middleware to parse JSON body
app.use('/', router); 

// Import the actual mocked constructors for spying/checking instantiation
const { ParkingFeeComputer } = require('../routes/parkingFeeCompute1');
const { ParkingFeeComputer2 } = require('../routes/parkingFeeCompute2');
const { ParkingFeeComputer3 } = require('../routes/parkingFeeCompute3');


describe('POST /calculate-fee', () => {
    // Standard mock payload for success cases
    const validPayload1 = {
        entryDateTime: "2024-03-05T08:00:00.000Z", // Tuesday
        exitDateTime: "2024-03-05T10:30:00.000Z",
        rateType: "Hourly",
        vehicleType: "Car",
        modelCatalogKey: "COMPREHENSIVE_RATES"
    };

    beforeEach(() => {
        // Clear all mock history and reset implementations before each test
        jest.clearAllMocks();
    });

    // --- A. Input Validation Tests (Status 400) ---
    describe('Input Validation (Missing Fields)', () => {
        const requiredFields = ["entryDateTime", "exitDateTime", "rateType", "vehicleType", "modelCatalogKey"];
        
        requiredFields.forEach(field => {
            it(`should return 400 if ${field} is missing`, async () => {
                const invalidPayload = { ...validPayload1 };
                delete invalidPayload[field];

                const response = await request(app)
                    .post('/calculate-fee')
                    .send(invalidPayload);

                expect(response.statusCode).toBe(400);
                expect(response.body.error).toBe("Missing parameters.");
                expect(response.body.required).toEqual(expect.arrayContaining(requiredFields));
            });
        });

        it('should return 400 if modelCatalogKey is invalid', async () => {
            const invalidPayload = { ...validPayload1, modelCatalogKey: "NON_EXISTENT_RATES" };

            const response = await request(app)
                .post('/calculate-fee')
                .send(invalidPayload);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("Invalid modelCatalogKey");
        });
    });
    
    // --- A1. Date and Time Validation Tests (Status 400) ---
    describe('Input Validation (Date/Time Logic)', () => {
        it('should return 400 if entryDateTime is after exitDateTime', async () => {
            const invalidPayload = {
                ...validPayload1,
                entryDateTime: "2024-03-05T10:30:00.000Z", // Entry is LATER
                exitDateTime: "2024-03-05T08:00:00.000Z", 
            };

            const response = await request(app)
                .post('/calculate-fee')
                .send(invalidPayload);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("exitDateTime must be after entryDateTime.");
        });

        it('should return 400 if entryDateTime is not a valid ISO date string', async () => {
            const invalidPayload = {
                ...validPayload1,
                entryDateTime: "not-a-real-date", 
            };

            const response = await request(app)
                .post('/calculate-fee')
                .send(invalidPayload);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("Invalid date format for entryDateTime");
        });
        
        it('should return 400 if exitDateTime is not a valid ISO date string', async () => {
            const invalidPayload = {
                ...validPayload1,
                exitDateTime: "another-fake-date", 
            };

            const response = await request(app)
                .post('/calculate-fee')
                .send(invalidPayload);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("Invalid date format for exitDateTime");
        });
    });

    // --- C. Calculator 2 (ParkingFeeComputer2) Tests ---
    describe('Special Rate Calculator (ParkingFeeComputer2)', () => {
        const specialPayload = {
            entryDateTime: "2024-03-05T23:00:00.000Z",
            exitDateTime: "2024-03-06T00:30:00.000Z",
            rateType: "Special",
            vehicleType: "HGV",
            modelCatalogKey: "BLOCK2_SPECIAL_RATES"
        };
        
        it('should use ParkingFeeComputer2 for "Special" rate type', async () => {
            const response = await request(app)
                .post('/calculate-fee')
                .send(specialPayload);

            // 1. Assert Status
            expect(response.statusCode).toBe(200);
            
            // 2. Assert Calculator Instantiation
            expect(ParkingFeeComputer2).toHaveBeenCalledTimes(1);
            expect(ParkingFeeComputer).not.toHaveBeenCalled();
            expect(ParkingFeeComputer3).not.toHaveBeenCalled();

            // 3. Assert Constructor Arguments for PC2 (Custom Signature)
            expect(ParkingFeeComputer2).toHaveBeenCalledWith(
                expect.any(Array), // feeModels
                specialPayload.entryDateTime,
                specialPayload.exitDateTime,
                specialPayload.rateType,
                specialPayload.vehicleType
            );

            // 4. Assert Response Body
            expect(response.body.total_fee).toBe(20.00);
        });

        it('should use ParkingFeeComputer2 for "Block2" rate type', async () => {
            const payload = { ...specialPayload, rateType: "Block2" };
            
            const response = await request(app)
                .post('/calculate-fee')
                .send(payload);

            expect(ParkingFeeComputer2).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toBe(200);
        });
    });

    // --- D. Calculator 3 (ParkingFeeComputer3) Tests ---
    describe('Staff Estate Calculator (ParkingFeeComputer3)', () => {
        const staffPayload = {
            entryDateTime: "2024-03-04T09:00:00.000Z", // Monday
            exitDateTime: "2024-03-04T11:00:00.000Z",
            rateType: "Staff Estate A",
            vehicleType: "MC",
            modelCatalogKey: "STAFF_ESTATE_RATES"
        };
        
        it('should use ParkingFeeComputer3 for "Staff Estate A" rate type', async () => {
            const response = await request(app)
                .post('/calculate-fee')
                .send(staffPayload);

            // 1. Assert Status
            expect(response.statusCode).toBe(200);

            // 2. Assert Calculator Instantiation
            expect(ParkingFeeComputer3).toHaveBeenCalledTimes(1);
            expect(ParkingFeeComputer).not.toHaveBeenCalled();
            expect(ParkingFeeComputer2).not.toHaveBeenCalled();

            // 3. Assert Constructor Arguments for PC3 (Custom Signature)
            expect(ParkingFeeComputer3).toHaveBeenCalledWith(
                expect.any(Array), // feeModels
                staffPayload.entryDateTime,
                staffPayload.exitDateTime,
                staffPayload.rateType,
                staffPayload.vehicleType
            );

            // 4. Assert Response Body
            expect(response.body.total_fee).toBe(0.00); // Mocked return value for PC3
        });
        
        it('should use ParkingFeeComputer3 for "URA Staff" rate type', async () => {
            const payload = { ...staffPayload, rateType: "URA Staff" };
            
            const response = await request(app)
                .post('/calculate-fee')
                .send(payload);

            expect(ParkingFeeComputer3).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toBe(200);
        });
        
        it('should use ParkingFeeComputer3 for "Staff Estate B" rate type', async () => {
            const payload = { ...staffPayload, rateType: "Staff Estate B" };
            
            const response = await request(app)
                .post('/calculate-fee')
                .send(payload);

            expect(ParkingFeeComputer3).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toBe(200);
        });
    });

    // --- E. Error Handling Test (Status 500) ---
    describe('Error Handling (Internal)', () => {
        it('should return 500 if the calculator throws an internal error', async () => {
            // Mock the default calculator's computeParkingFee to throw an error
            mockComputeFee1.mockImplementationOnce(() => {
                throw new Error("Date parsing failed");
            });

            const response = await request(app)
                .post('/calculate-fee')
                .send(validPayload1);

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe("Internal server error during fee calculation.");
            expect(response.body.details).toBe("Date parsing failed");
        });
    });
});