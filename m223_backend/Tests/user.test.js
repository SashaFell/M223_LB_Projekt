const request = require('supertest');
const app = require('../app'); // Passe den Pfad entsprechend an
const { sequelize } = require('../dbConn'); // Passe den Pfad entsprechend an

describe('POST /register', () => {
    beforeAll(async () => {
        // Verbindung zur Datenbank herstellen (einmalig vor allen Tests)
        await sequelize.sync(); // Synchronisiere die Models mit der Datenbank
    });

    afterAll(async () => {
        // Schließe die Verbindung zur Datenbank nach allen Tests
        await sequelize.close();
    });

    it('should create a new user', async () => {
        const userData = {
            user: 'newUser',
            pwd: 'Test123!@#',
            role: 'Admin'
        };

        const response = await request(app)
            .post('/register')
            .send(userData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', 'New user newUser created!');
    });
});
