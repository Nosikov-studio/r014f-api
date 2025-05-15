const mysql = require("mysql2");
const express = require("express");
const cors = require('cors');
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "expo",
    password: "password"
});



app.use(cors());
app.use(express.json());

app.set("view engine", "hbs");
// *****************************работа с шаблонизатором***********************
// получение списка пользователей
app.get("/", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) {
        if(err) return console.log(err);
        res.render("index.hbs", {
            users: data
        });
    });
});

// получаем данные и добавляем их в БД 
app.post("/create", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;
    pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});
//******************************работа с API*************************************
// получаем  все данные по api 
app.get("/api", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.json(data);
    });
});
// получаем  данные одной записи по api
app.get("/api/:id", function(req, res){
    const id=req.params.id;
    pool.query("SELECT * FROM tab1 WHERE id=?", [id], function(err, data) { 

        res.json(data);
    });
});
// добавляем данные по api
app.post("/api", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;
    console.log('from backblabla');
    pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {
        if(err) return console.log(err);
        console.log('from back'+data);
        res.json(data);
    });
});


// редактируем конкретную запись (id) по api
app.post("/api/edit", urlencodedParser, function (req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const id = req.body.id;
    pool.query("UPDATE tab1 SET name=?, age=? WHERE id=?", [name, age, id], function(err, data) {
        res.json(data);
    });
});


// удаление конкретной записи (id) по api
app.post("/delete/:id", function(req, res){
    const id = req.params.id;
    pool.query("DELETE FROM tab1 WHERE id=?", [id], function(err, data) {
        
        res.json(data);
    });
});

//***********************включение сервера*******************************************

app.listen(30333, function(){
    console.log("Сервер ожидает подключения...");
});