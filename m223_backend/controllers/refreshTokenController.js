const { sequelize } = require('../config/dbConn'); // Importieren Sie die Verbindung zu Ihrer MySQL-Datenbank
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        // Führen Sie eine SQL-Abfrage aus, um den Benutzer anhand des Refresh-Tokens zu finden
        const [users, metadata] = await sequelize.query('SELECT * FROM users WHERE refreshToken = :refreshToken', {
            replacements: { refreshToken }
        });

        // Überprüfen Sie, ob ein Benutzer mit dem übergebenen Refresh-Token gefunden wurde
        if (!users || users.length === 0) return res.sendStatus(403);

        const foundUser = users[0];

        // Überprüfen Sie das JWT-Token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

                // Erstellen Sie ein neues Zugriffstoken
                const roles = Object.values(foundUser.roles);
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": decoded.username,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10s' }
                );
                res.json({ roles, accessToken });
            }
        );
    } catch (error) {
        console.error('Error while handling refresh token:', error);
        res.sendStatus(500);
    }
};

module.exports = { handleRefreshToken };