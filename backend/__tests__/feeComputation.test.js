const request = require('supertest');
const express = require('express');

// --- 1. MOCK EXTERNAL DEPENDENCIES ---
// Mock the imported Calculator classes from their paths
jest.mock('../routes/parkingFeeCompute1', () => ({
    ParkingFeeComputer: jest.fn().mockImplementation(() => ({
        computeParkingFee: jest.fn(() => 7.50), // Default success fee for Hourly
    })),
}));
jest.mock('../routes/parkingFeeCompute2', () => ({
    ParkingFeeComputer2: jest.fn().mockImplementation(() => ({
        computeParkingFee: jest.fn(() => 15.00), // Default success fee for Special
    })),
}));
jest.mock('../routes/parkingFeeCompute3', () => ({
    ParkingFeeComputer3: jest.fn().mockImplementation(() => ({
        computeParkingFee: jest.fn(() => 10.00), // Default success fee for Block1
    })),
}));
jest.mock('../routes/parkingFeeCompute4', () => ({
    ParkingFeeComputer4: jest.fn().mockImplementation(() => ({
        computeParkingFee: jest.fn(() => 5.00), // Default success fee for Class1
    })),
}));

// Mock the global 'fetch' for API testing
global.fetch = jest.fn();

// --- 2. IMPORT THE MODULE TO TEST ---
// We must load the router *after* mocking its dependencies
const router = require('../routes/feeComputation'); // Assuming the router file is named parking_router.js in the same directory

// Create a mock Express application to test the router
const app = express();
app.use(express.json());
app.use('/', router);

// Destructure mock classes for spying and assertion
const { ParkingFeeComputer } = require('../routes/parkingFeeCompute1');
const { ParkingFeeComputer2 } = require('../routes/parkingFeeCompute2');
const { ParkingFeeComputer3 } = require('../routes/parkingFeeCompute3');
const { ParkingFeeComputer4 } = require('../routes/parkingFeeCompute4');

// Define mock data structure for API response
const MOCK_TARIFFS = [
    { rate_type: "Hourly", vehicle_type: "Car", from_time: "1970-01-01T08:00:00", to_time: "1970-01-01T17:00:00", fee_model: "Hourly_Model" },
    { rate_type: "Special", vehicle_type: "Car", from_time: "10:00:00", to_time: "12:00:00", fee_model: "Special_Model" },
    { rate_type: "Block1", vehicle_type: "Truck", from_time: "14:00:00", to_time: "16:00:00", fee_model: "Block1_Model" },
    { rate_type: "Class2", vehicle_type: "Bike", from_time: "14:00:00", to_time: "16:00:00", fee_model: "Class2_Model" },
    { rate_type: "UnknownRate", vehicle_type: "Car", from_time: "00:00:00", to_time: "23:59:59", fee_model: "Unknown" },
    // Another tariff for the default group to test filtering
    { rate_type: "Authorized", vehicle_type: "Car", from_time: "00:00:00", to_time: "23:59:59", fee_model: "Auth_Model" }
];

// Helper to access non-exported functions (if needed, though here we test the route end-to-end)
// Since we can't easily import non-exported helpers, we focus on the route and core logic flow.

describe('Parking Fee Router /calculate-fee', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the mock calculator implementations before each test
        ParkingFeeComputer.mockClear();
        ParkingFeeComputer2.mockClear();
        ParkingFeeComputer3.mockClear();
        ParkingFeeComputer4.mockClear();
    });

    // Mock API response handler for success
    const mockApiSuccess = (data, isWrapped = false) => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(isWrapped ? { data } : data),
                text: () => Promise.resolve(JSON.stringify(isWrapped ? { data } : data)),
            })
        );
    };

    // Mock API response handler for failure
    const mockApiFailure = (status) => {
        global.fetch.mockImplementation(() =>
            Promise.resolve({
                ok: false,
                status: status,
                text: () => Promise.resolve(`Error ${status}`),
            })
        );
    };

    // --- A. INPUT VALIDATION TESTS ---
    it('should return 400 if entryDateTime is missing', async () => {
        const response = await request(app)
            .post('/calculate-fee')
            .send({
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Hourly',
                vehicleType: 'Car',
                modelCatalogKey: 'COMPREHENSIVE_RATES'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Missing parameters.");
    });

    it('should return 400 for invalid date format (entry)', async () => {
        mockApiSuccess(MOCK_TARIFFS);
        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: 'not-a-date',
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Hourly',
                vehicleType: 'Car',
                modelCatalogKey: 'COMPREHENSIVE_RATES'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Invalid date format for entryDateTime or exitDateTime.");
    });

    it('should return 400 if exitDateTime is before entryDateTime', async () => {
        mockApiSuccess(MOCK_TARIFFS);
        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: '2025-11-20T12:30:00',
                exitDateTime: '2025-11-20T10:00:00',
                rateType: 'Hourly',
                vehicleType: 'Car',
                modelCatalogKey: 'COMPREHENSIVE_RATES'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("exitDateTime must be after entryDateTime.");
    });

    // --- B. API AND DATA HANDLING TESTS ---
    it('should successfully handle wrapped API response data', async () => {
        mockApiSuccess(MOCK_TARIFFS, true); // Use wrapped response: { data: [...] }

        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: '2025-11-20T10:00:00',
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Hourly',
                vehicleType: 'Car',
                modelCatalogKey: 'COMPREHENSIVE_RATES'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.total_fee).toBe(7.50);
        expect(ParkingFeeComputer).toHaveBeenCalledTimes(1);
    });

    // --- C. CALCULATOR SELECTION TESTS ---
    it('should use ParkingFeeComputer for "Hourly" rateType (Default/Comprehensive)', async () => {
        mockApiSuccess(MOCK_TARIFFS); 

        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: '2025-11-20T10:00:00',
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Hourly',
                vehicleType: 'Car',
                modelCatalogKey: 'COMPREHENSIVE_RATES'
            });

        expect(response.statusCode).toBe(200);
        expect(ParkingFeeComputer).toHaveBeenCalledTimes(1);
        expect(ParkingFeeComputer2).not.toHaveBeenCalled();
        expect(response.body.total_fee).toBe(7.50);
        
        // Check if the time format cleaning worked on the tariffs passed
        const constructorCall = ParkingFeeComputer.mock.calls[0][2]; // 3rd argument is filtered feeModels
        expect(constructorCall.length).toBe(1);
        expect(constructorCall[0].from_time).toBe('08:00:00'); // Should be cleaned from 1970 date
    });

    it('should use ParkingFeeComputer2 for "Special" rateType (Block2_Special)', async () => {
        mockApiSuccess(MOCK_TARIFFS); 

        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: '2025-11-20T10:00:00',
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Special',
                vehicleType: 'Car',
                modelCatalogKey: 'BLOCK2_SPECIAL_RATES'
            });

        expect(response.statusCode).toBe(200);
        expect(ParkingFeeComputer2).toHaveBeenCalledTimes(1);
        expect(ParkingFeeComputer).not.toHaveBeenCalled();
        expect(response.body.total_fee).toBe(15.00);
    });

    it('should use ParkingFeeComputer3 for "Block1" rateType (Staff_Estate)', async () => {
        mockApiSuccess(MOCK_TARIFFS); 

        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: '2025-11-20T10:00:00',
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Block1',
                vehicleType: 'Truck',
                modelCatalogKey: 'STAFF_ESTATE_RATES'
            });

        expect(response.statusCode).toBe(200);
        expect(ParkingFeeComputer3).toHaveBeenCalledTimes(1);
        expect(ParkingFeeComputer).not.toHaveBeenCalled();
        expect(response.body.total_fee).toBe(10.00);
    });
    
    it('should use ParkingFeeComputer4 for "Class2" rateType (Class1_Rates)', async () => {
        mockApiSuccess(MOCK_TARIFFS); 

        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: '2025-11-20T10:00:00',
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Class2',
                vehicleType: 'Bike',
                modelCatalogKey: 'CLASS1_RATES'
            });

        expect(response.statusCode).toBe(200);
        expect(ParkingFeeComputer4).toHaveBeenCalledTimes(1);
        expect(ParkingFeeComputer).not.toHaveBeenCalled();
        expect(response.body.total_fee).toBe(5.00);
    });

    // --- D. ERROR PATHS AND EDGE CASES ---
    it('should return 400 if modelCatalogKey is invalid/missing in the fetched data', async () => {
        mockApiSuccess(MOCK_TARIFFS); 

        const response = await request(app)
            .post('/calculate-fee')
            .send({
                entryDateTime: '2025-11-20T10:00:00',
                exitDateTime: '2025-11-20T12:30:00',
                rateType: 'Hourly',
                vehicleType: 'Car',
                modelCatalogKey: 'NON_EXISTENT_MODEL' // This key is not in the hardcoded catalog structure
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain("Invalid modelCatalogKey: NON_EXISTENT_MODEL");
    });
});