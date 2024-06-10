const { sequelize } = require('../config/dbConn'); // Importieren Sie die Verbindung zu Ihrer MySQL-Datenbank

const handleLogout = async (req, res) => {
    // Auf dem Client auch den accessToken löschen
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // Kein Inhalt
    const refreshToken = cookies.jwt;

    try {
        // Überprüfen, ob das Refresh-Token in der Datenbank vorhanden ist
        const [users, metadata] = await sequelize.query('SELECT * FROM users WHERE refreshToken = :refreshToken', {
            replacements: { refreshToken }
        });

        // Wenn kein Benutzer mit dem übergebenen Refresh-Token gefunden wurde, löschen Sie das Cookie und senden Sie 204 zurück
        if (!users || users.length === 0) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        // Löschen Sie das Refresh-Token in der Datenbank
        const [updatedRows, updateMetadata] = await sequelize.query('UPDATE users SET refreshToken = "" WHERE refreshToken = :refreshToken', {
            replacements: { refreshToken }
        });

        // Überprüfen Sie, ob das Refresh-Token erfolgreich gelöscht wurde
        if (updatedRows === 0) {
            // Wenn keine Zeilen aktualisiert wurden, senden Sie einen Fehlerstatus zurück
            return res.status(500).send('Failed to logout');
        }

        // Löschen Sie das Cookie und senden Sie 204 zurück
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error while handling logout:', error);
        res.sendStatus(500);
    }
};

module.exports = { handleLogout };