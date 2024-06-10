const { sequelize } = require('../config/dbConn'); // Importieren Sie die Verbindung zu Ihrer MySQL-Datenbank

const getAllEmployees = async (req, res) => {
    try {
        // Führen Sie eine SQL-Abfrage aus, um alle Mitarbeiter aus der Datenbank abzurufen
        const [employees, metadata] = await sequelize.query('SELECT * FROM employees');

        // Überprüfen Sie, ob Mitarbeiter gefunden wurden
        if (!employees || employees.length === 0) {
            return res.status(204).json({ 'message': 'No employees found.' });
        }

        // Senden Sie die Mitarbeiterdaten als Antwort zurück
        res.json(employees);
    } catch (error) {
        console.error('Error while getting employees:', error);
        res.sendStatus(500);
    }
}

const createNewEmployee = async (req, res) => {
    const { firstname, lastname } = req.body;
    if (!firstname || !lastname) {
        return res.status(400).json({ 'message': 'First and last names are required' });
    }

    try {
        // Führen Sie eine SQL-Abfrage aus, um einen neuen Mitarbeiter in die Datenbank einzufügen
        const [result, metadata] = await sequelize.query('INSERT INTO employees (firstname, lastname) VALUES (:firstname, :lastname)', {
            replacements: { firstname, lastname }
        });

        // Senden Sie die Ergebnisdaten als Antwort zurück
        res.status(201).json({ id: result.insertId, firstname, lastname });
    } catch (error) {
        console.error('Error while creating new employee:', error);
        res.sendStatus(500);
    }
}

const updateEmployee = async (req, res) => {
    const { id, firstname, lastname } = req.body;
    if (!id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    try {
        // Führen Sie eine SQL-Abfrage aus, um den Mitarbeiter in der Datenbank zu aktualisieren
        const [updatedRows, updateMetadata] = await sequelize.query('UPDATE employees SET firstname = :firstname, lastname = :lastname WHERE id = :id', {
            replacements: { id, firstname, lastname }
        });

        // Überprüfen Sie, ob der Mitarbeiter erfolgreich aktualisiert wurde
        if (updatedRows === 0) {
            return res.status(204).json({ "message": `No employee matches ID ${id}.` });
        }

        // Senden Sie eine Erfolgsmeldung zurück
        res.json({ id, firstname, lastname });
    } catch (error) {
        console.error('Error while updating employee:', error);
        res.sendStatus(500);
    }
}

const deleteEmployee = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ 'message': 'Employee ID required.' });

    try {
        // Führen Sie eine SQL-Abfrage aus, um den Mitarbeiter aus der Datenbank zu löschen
        const [deletedRows, deleteMetadata] = await sequelize.query('DELETE FROM employees WHERE id = :id', {
            replacements: { id }
        });

        // Überprüfen Sie, ob der Mitarbeiter erfolgreich gelöscht wurde
        if (deletedRows === 0) {
            return res.status(204).json({ "message": `No employee matches ID ${id}.` });
        }

        // Senden Sie eine Erfolgsmeldung zurück
        res.json({ id });
    } catch (error) {
        console.error('Error while deleting employee:', error);
        res.sendStatus(500);
    }
}

const getEmployee = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ 'message': 'Employee ID required.' });

    try {
        // Führen Sie eine SQL-Abfrage aus, um den Mitarbeiter aus der Datenbank abzurufen
        const [employees, metadata] = await sequelize.query('SELECT * FROM employees WHERE id = :id', {
            replacements: { id }
        });

        // Überprüfen Sie, ob der Mitarbeiter gefunden wurde
        if (!employees || employees.length === 0) {
            return res.status(204).json({ "message": `No employee matches ID ${id}.` });
        }

        // Senden Sie die Mitarbeiterdaten als Antwort zurück
        res.json(employees[0]);
    } catch (error) {
        console.error('Error while getting employee:', error);
        res.sendStatus(500);
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}