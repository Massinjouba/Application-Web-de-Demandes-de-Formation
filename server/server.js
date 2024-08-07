const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ramassinissa@gmail.com',
        pass: 'votre_mot_de_passe' // Assurez-vous que le mot de passe est correct
    }
});

app.post('/submit', (req, res) => {
    const formData = req.body;

    const mailOptions = {
        from: 'ramassinissa@gmail.com',
        to: 'massinissaidirr@gmail.com',
        subject: 'Nouvelle demande de formation',
        text: JSON.stringify(formData, null, 2)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error); // Log détaillé de l'erreur
            return res.status(500).send('Erreur lors de l\'envoi de l\'email.');
        }

        const filePath = path.join(__dirname, '..', 'form-data.json');
        fs.readFile(filePath, (err, data) => {
            let jsonData = [];
            if (!err && data.length > 0) {
                jsonData = JSON.parse(data);
            }
            jsonData.push(formData);
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Erreur lors de l\'enregistrement des données:', err); // Log détaillé de l'erreur
                    return res.status(500).send('Erreur lors de l\'enregistrement des données.');
                }
                res.status(200).send('Formulaire soumis avec succès.');
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
