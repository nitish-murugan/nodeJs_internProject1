const request = require('supertest');
const app = require('../server');

describe('School Management API', () => {
    describe('GET /', () => {
        it('should return API health check', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('School Management API');
        });
    });

    describe('POST /addSchool', () => {
        it('should add a new school with valid data', async () => {
            const schoolData = {
                name: 'Test School',
                address: '123 Test Street, Test City',
                latitude: 28.6139,
                longitude: 77.2090
            };

            const response = await request(app)
                .post('/addSchool')
                .send(schoolData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(schoolData.name);
        });

        it('should return validation error for missing data', async () => {
            const response = await request(app)
                .post('/addSchool')
                .send({
                    name: 'Incomplete School'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Validation error');
        });
    });

    describe('GET /listSchools', () => {
        it('should return schools sorted by proximity', async () => {
            const response = await request(app)
                .get('/listSchools')
                .query({
                    latitude: 28.6139,
                    longitude: 77.2090
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should return validation error for missing coordinates', async () => {
            const response = await request(app)
                .get('/listSchools')
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });
});
