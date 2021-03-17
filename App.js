const fs = require("fs");
const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(fileUpload());
app.use(express.json());

// Permet de récupérer l'ensemble des utilisateurs
const readUsers = () => JSON.parse(fs.readFileSync("./user.json").toString());

getAge = (dateString) => {
    let today = new Date();
    let birthDates = new Date(dateString);
    let age = today.getFullYear() - birthDates.getFullYear();
    let m = today.getMonth() - birthDates.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDates.getDate())) {
        age--;
    }
    return age;
}

// Retourne la liste d'utilisateurs
app.get("/users", (req, res) => {
    res.json(readUsers());
});

// Création d'un utilisateur
app.post("/users", (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    // Récupère le fichier
    const myFile = req.files.file;
    // Récupère le body de la request
    const body = req.body;
    // Récupère la liste des users
    const users = readUsers();

    //  Sauvegarde le fichier dans le dossier public de l'api
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
    });

    // Check si le mail est déjà utilisé
    users.filter((user) => {
        console.log(user);
        if (user.email === body.email) {
            console.log('user: ', user.email, 'new user: ', body.email);
            return res.status(500).send({msg: "Cet email est déjà utilisé"});
        }
    })

    // Création du nouveau user
    const newUser = {
        id: Math.max(...users.map((user) => user.id)) + 1,
        lastName: body.lastName.toUpperCase(),
        firstName: body.firstName,
        email: body.email,
        birthDate: body.birthDate,
        avatarUrl: `/home/jordanb/MyDigitalSchool/Vue.js/api-user/trombi-dev/public/${myFile.name}`,
        gender: body.gender,
        age: getAge(body.birthDate)
    };

    // Ajoute le nouveau user dans le tableau d'users
    users.push(newUser);

    // Ecris dans le fichier pour insérer la liste des users
    fs.writeFileSync("./user.json", JSON.stringify(users, null, 4));

    res.json(users);
});

// Modification d'un utilisateur
app.put("/users/:id", (req, res) => {
    const body = req.body;

    // Récupère la liste des users
    const users = readUsers();

    // Création du nouveau user
    const id = Number(req.params.id);
    const newUser = {
        id: id,
        lastName: body.lastName.toUpperCase(),
        firstName: body.firstName,
        email: body.email,
        birthDate: body.birthDate,
        avatarUrl: body.avatarUrl,
        gender: body.gender,
        age: getAge(body.birthDate)
    };

    // Ajoute le nouveau user dans le tableau d'users
    const newUsers = [...users.filter((user) => user.id !== id), newUser];

    // Ecris dans le fichier pour insérer la liste des users
    fs.writeFileSync("./user.json", JSON.stringify(newUsers, null, 4));
    res.json(newUser);
});

// Suppression d'un utilisateur
app.delete("/users/:id", (req, res) => {
    // Récupère la liste des users
    const users = readUsers();

    // Supprime l'utilisateur de la liste en fonction de l'id passé en param
    const usersFiltered = users.filter((user) => user.id !== Number(req.params.id));

    // Ecris dans le fichier pour insérer la liste des users
    fs.writeFileSync("./user.json", JSON.stringify(usersFiltered, null, 4));
    res.json(usersFiltered);
});

// Retourne un utilisateur en fonction de son id
app.get("/users/:id", (req, res) => {
    const body = req.body;

    // Récupère la liste des users
    const users = readUsers();
    // Récupère l'utilisateur en fonction de son id
    const user = users.find((user) => user.id === Number(req.params.id));

    res.json(user);
});

app.listen(6929, () => console.log("Server is running at port 6929"));
