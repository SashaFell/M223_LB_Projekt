const { sequelize } = require('../config/dbConn'); // Importieren Sie die Verbindung zu Ihrer MySQL-Datenbank
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // Suchen Sie den Benutzer in der Datenbank anhand des Benutzernamens
        const [users, metadata] = await sequelize.query('SELECT * FROM users WHERE username = :username', {
            replacements: { username: user }
        });

        // Überprüfen, ob ein Benutzer mit dem angegebenen Benutzernamen gefunden wurde
        if (!users || users.length === 0) return res.sendStatus(401); // Unauthorized 

        // Vergleichen Sie das eingegebene Passwort mit dem Passwort des gefundenen Benutzers
        const foundUser = users[0];
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            // Extrahieren Sie die Rollen des Benutzers
            const roles = Object.values(foundUser.roles).filter(Boolean);

            // Erstellen Sie JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // Aktualisieren Sie den Refresh-Token des Benutzers in der Datenbank
            const [updatedRows, updateMetadata] = await sequelize.query('UPDATE users SET refreshToken = :refreshToken WHERE id = :userId', {
                replacements: { refreshToken, userId: foundUser.id }
            });

            // Überprüfen Sie, ob das Aktualisieren des Refresh-Tokens erfolgreich war
            if (updatedRows === 0) {
                // Wenn keine Zeilen aktualisiert wurden, senden Sie einen Fehlerstatus zurück
                return res.status(500).send('Failed to update refresh token');
            }

            // Erstellen Sie ein sicheres Cookie mit dem Refresh-Token
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            // Senden Sie Autorisierungsrollen und Zugriffstoken an den Benutzer zurück
            res.json({ roles, accessToken });

        } else {
            // Wenn das Passwort nicht übereinstimmt, senden Sie einen Unauthorized-Status zurück
            res.sendStatus(401);
        }
    } catch (error) {
        console.error('Error while handling login:', error);
        res.sendStatus(500);
    }
};

module.exports = { handleLogin };