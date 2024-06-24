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

    it('should handle duplicate username gracefully', async () => {
        const userData = {
            user: 'existingUser', // Annahme: 'existingUser' ist bereits in der Datenbank vorhanden
            pwd: 'Test123!@#',
            role: 'Editor'
        };

        const response = await request(app)
            .post('/register')
            .send(userData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(409); // 409 für Konflikt, wenn der Benutzername bereits existiert
        expect(response.body).toHaveProperty('message', 'Username Taken');
    });
});
