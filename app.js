const mysql = require("mysql2");
const mysql2 = require ('mysql2/promise');
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
const pool2 = mysql2.createPool({
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

// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;
    pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {
        if(err) return console.log(err);
        res.redirect("/");
    });
});

app.get("/api", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.json(data);
    });
});

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
//******************************************************************************************
// *********************работа разными подходами (метод get) - ТОЛЬКО СУТЬ! (без проверок)***********************
//******************************************без БД************************************************

// (без обращения к БД) с выдачей html

app.get("/pupuh", function(req, res){
    res.send('<h1 style="font-size:50px; color:lime"> Its PUPUH!!!!! </h1>');
});

// (без обращения к БД) с выдачей json

app.get("/pupuj", function(req, res){
    res.json([{id:101, name:'vasa', age:39}]);
});

// (без обращения к БД) с генерацией страницы (pupu.hbs)

app.get("/puput", function(req, res){
    res.render("pupu.hbs");
});
// (без обращения к БД) с генерацией страницы (pupu.hbs) и передачей в неё простых данных

app.get("/puputj", function(req, res){
    res.render("pupu.hbs", {id:102, name:'olga', age:45});
});

// (без обращения к БД) с генерацией страницы (pupu.hbs) и передачей в неё массива данных

app.get("/puputja", function(req, res){
    res.render("pupu.hbs", {array:[{id:102, name:'olga', age:45},{id:103, name:'Evgeny', age:50},{id:104, name:'kuku', age:101}]});
});

//*************************************БД (функция query) *************************************************************

// с помощью колбэков (требуется mysql2)
app.get("/kuku", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.send(`<b style="font-size:50px; color:green">blablabla!!!<br> ${JSON.stringify(data)}</b>`);
    });
});
// На самом деле колбэк-функция имеет три параметра function(err, results, fields)
/*
Первый параметр передает ошибка, если она возникла при выполнении запроса. 
Второй параметр - results (или data) собственно представляет в виде массива те данные, которые получила команда SELECT. 
И третий параметр fields хранит метаданные полей таблицы и дополнительную служебную информацию.

*/
// с помощью колбэков (требуется mysql2) - если хотим отправить только первый объект (в JSON)
app.get("/kuku/f", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.send(`<b style="font-size:50px; color:green">blablabla!!!<br> ${JSON.stringify(data[1])}</b>`);
    });
});

// с помощью колбэков (требуется mysql2) - отправка только JSON
app.get("/kukuj", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.json(data);
    });
});

// с помощью колбэков (требуется mysql2) 
app.get("/nunu", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.send(`<b style="font-size:50px; color:pink">nununununu!!!<br> ${(data[0]['name'])}</b>`);
    });
});

// с помощью колбэков (требуется mysql2) - отправка только JSON
app.get("/juju", function(req, res){
    pool.query("SELECT * FROM tab1", function(err, data) { 

        res.json(data);
    });
});
//***********************************************************************************************************
// Здесь 'r' (results или data) - полученные из БД данные в виде массива, а 'f' (fields) - метаданные полей данных
// с помощью промисов (требуется mysql2/promise)
app.get("/bubu", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function([r, f]) {
        res.send(`<b style="font-size:50px; color:blue"> heaven <br> ${JSON.stringify(r)}</b>/`);
    });
});
// с помощью промисов (требуется mysql2/promise) - если хотим отправить только первый объект (в JSON)
app.get("/bubu/f", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function([r, f]) {
        res.send(`<b style="font-size:50px; color:blue"> heaven <br> ${JSON.stringify(r[1])}</b>/`);
    });
});

// с помощью промисов (требуется mysql2/promise) - отправка только JSON
app.get("/bubuj", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function([r, f]) {
        res.json(r);
    });
});
// Далее здесь 'data' будет имеет структуру из двух массивов [r, f]
// с помощью промисов (требуется mysql2/promise)
app.get("/mumu", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function(data) {
        res.send(`<b style="font-size:50px; color:brown"> sobaka??? <br> ${JSON.stringify(data[0])}</b>/`);
    });
});

// с помощью промисов (требуется mysql2/promise)- если хотим отправить только первый объект (в JSON)
app.get("/mumu/f", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function(data) {
        res.send(`<b style="font-size:50px; color:brown"> sobaka??? <br> ${JSON.stringify(data[0][1])}</b>/`);
    });
});

// с помощью промисов (требуется mysql2/promise) - отправка только JSON
app.get("/jujup", function(req, res){
    pool2.query("SELECT * FROM tab1").then(function(data) {
        res.json(data[0]);
    });
});
//***********************************************************************************************************


// с помощью async - await (требуется mysql2/promise)
app.get("/lulu", async function(req, res){
    let d=await pool2.query("SELECT * FROM tab1");    
    res.send(`<b style="font-size:50px; color:red"> fire!!!<br> fire!!! <br> ${JSON.stringify(d[0])} </b>/`);
    });

// с помощью async - await (требуется mysql2/promise)- если хотим отправить только первый объект (в JSON)
app.get("/lulu/f", async function(req, res){
    let d=await pool2.query("SELECT * FROM tab1");    
    res.send(`<b style="font-size:50px; color:red"> fire!!!<br> fire!!! <br> ${JSON.stringify(d[0][1])} </b>/`);
    });

// с помощью async - await (требуется mysql2/promise)- отправка только JSON
app.get("/julua", async function(req, res){
    let d=await pool2.query("SELECT * FROM tab1");    
    res.json(d[0]);
    });    

    //***********************************************************************************************************
// *****************************работа с get и параметрами (/:id)****************************************************************

// с помощью колбэков (требуется mysql2) получем id пользователя, получаем его из бд - отправляем html
app.get("/kuku/:id", function(req, res){
    const id=req.params.id;
    pool.query("SELECT * FROM tab1 WHERE id=?", [id], function(err, data) { 

        res.send(`<b style="font-size:50px; color:green">blablabla!!!<br> ${JSON.stringify(data)}</b>`);
    });
});

// с помощью колбэков (требуется mysql2) получем id пользователя, получаем его из бд - отправляем json
app.get("/kukuj/:id", function(req, res){
    const id=req.params.id;
    pool.query("SELECT * FROM tab1 WHERE id=?", [id], function(err, data) { 

        res.json(data);
    });
});
//************************************** */
// с помощью промисов (требуется mysql2/promise)получем id пользователя, получаем его из бд - отправляем html
app.get("/bubu/:id", function(req, res){
    const id=req.params.id;
    pool2.query("SELECT * FROM tab1 WHERE id=?", [id]).then(function([r, f]) {
        res.send(`<b style="font-size:50px; color:blue"> heaven <br> ${JSON.stringify(r)}</b>/`);
    });
});

// с помощью промисов (требуется mysql2/promise)получем id пользователя, получаем его из бд - отправляем json
app.get("/bubuj/:id", function(req, res){
    const id=req.params.id;
    pool2.query("SELECT * FROM tab1 WHERE id=?", [id]).then(function([r, f]) {
        res.json(r);
    });
});
//************************************** */
// с помощью async - await (требуется mysql2/promise)получем id пользователя, получаем его из бд - отправляем html
app.get("/lulu/:id", async function(req, res){
    const id=req.params.id;
    let d=await pool2.query("SELECT * FROM tab1 WHERE id=?", [id]);    
    res.send(`<b style="font-size:50px; color:red"> fire!!!<br> fire!!! <br> ${JSON.stringify(d[0])} </b>/`);
    });


// с помощью async - await (требуется mysql2/promise)получем id пользователя, получаем его из бд - отправляем json
app.get("/julua/:id", async function(req, res){
    const id=req.params.id;
    let d=await pool2.query("SELECT * FROM tab1 WHERE id=?", [id]);    
    res.json(d[0]);
    });   

//************************запрос с двумя параметрами*********************************************************** */
// с помощью колбэков (требуется mysql2) получем по 'name' и 'age', получаем объект из бд - отправляем json
app.get("/kukuj/:name/:age", function(req, res){
    const name=req.params.name;
    const age=req.params.age;
    pool.query("SELECT * FROM tab1 WHERE name=? and age=?", [name, age], function(err, data) { 

        res.json(data);
    });
});

// с помощью промисов (требуется mysql2/promise)получем по 'name' и 'age', получаем объект из бд - отправляем json
app.get("/bubuj/:name/:age", function(req, res){
    const name=req.params.name;
    const age=req.params.age;
    pool2.query("SELECT * FROM tab1 WHERE name=? and age=?", [name, age]).then(function([r, f]) {
        res.json(r);
    });
});

// с помощью async - await (требуется mysql2/promise)получем по 'name' и 'age', получаем его из бд - отправляем json
app.get("/julua/:name/:age", async function(req, res){
    const name=req.params.name;
    const age=req.params.age;
    let d=await pool2.query("SELECT * FROM tab1 WHERE name=? and age=?", [name, age]);    
    res.json(d[0]);
    });   

//************************ query запрос*********************************************************** */
// с помощью колбэков (требуется mysql2)
// делаем запрос типа: http://truruki.ru/kukujq?name=victor&age=33
app.get("/kukuj", function(req, res){
    const name=req.query.name;
    const age=req.query.age;
    pool.query("SELECT * FROM tab1 WHERE name=? and age=?", [name, age], function(err, data) { 

        res.json(data);
    });
}); // НЕ РАБОТАЕТ!!! Так как есть точно такой же роут (/kukuj") выше, который и будет срабатывать!

// пробуем с измененным роутером
// делаем запрос типа: http://truruki.ru/kukujq?name=victor&age=33
app.get("/kukujq", function(req, res){
    const name=req.query.name;
    const age=req.query.age;
    pool.query("SELECT * FROM tab1 WHERE name=? and age=?", [name, age], function(err, data) { 

        res.json(data);
    });
}); // получаем результат!!!
// теперь отправляем 1 парамет - id
// делаем запрос типа: http://truruki.ru/kukujqid?id=12
app.get("/kukujqid", function(req, res){
    const id=req.query.id;
    pool.query("SELECT * FROM tab1 WHERE id=?", [id], function(err, data) { 

        res.json(data);
    });
}); // получаем результат!!!
//********************************
// с помощью промисов (требуется mysql2/promise)получем id пользователя, получаем его из бд - отправляем json
app.get("/bubujqid", function(req, res){
    const id=req.query.id;
    pool2.query("SELECT * FROM tab1 WHERE id=?", [id]).then(function([r, f]) {
        res.json(r);
    });
});
//********************************
// с помощью async - await (требуется mysql2/promise)получем id пользователя, получаем его из бд - отправляем json
app.get("/juluaqid", async function(req, res){
    const id=req.query.id;
    let d=await pool2.query("SELECT * FROM tab1 WHERE id=?", [id]);    
    res.json(d[0]);
    });   
//***********************************************************************************************************
// *****************************работа с POST****************************************************************
//***********************************************************************************************************

//********************************************************************************************************
// с помощью колбэков (требуется mysql2)

app.post("/buba", urlencodedParser, function (req, res) {    
    const name = req.body.name;
    const age = req.body.age;
    pool.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age], function(err, data) {        
        res.json(data);
    });
});

// с помощью промисов (требуется mysql2/promise)

app.post("/tuta", urlencodedParser, function (req, res) {    
    const name = req.body.name;
    const age = req.body.age;
    pool2.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age]).then(function([r, f]) {        
        res.json(r);
    });
});

// с помощью async - await (требуется mysql2/promise)

app.post("/guga", urlencodedParser, async function (req, res) {    
    const name = req.body.name;
    const age = req.body.age;
    let d=await pool2.query("INSERT INTO tab1 (name, age) VALUES (?,?)", [name, age]);        
        res.json(d[0]);
    });
//********************************************************************************************************** */
//************************************удаление********************************************************************** */
// с помощью колбэков (требуется mysql2)
app.post("/del/:id", function(req, res){
    const id = req.params.id;
    pool.query("DELETE FROM tab1 WHERE id=?", [id], function(err, data) {
        
        res.json(data);
    });
});

// с помощью промисов (требуется mysql2/promise)
app.post("/delp/:id", function(req, res){
    const id = req.params.id;
    pool2.query("DELETE FROM tab1 WHERE id=?", [id]).then(function(data) {
        
        res.json(data);
    });
});

// с помощью async - await (требуется mysql2/promise)
app.post("/delpa/:id", async function(req, res){
    const id = req.params.id;
    let d=await pool2.query("DELETE FROM tab1 WHERE id=?", [id]);    
    res.json(d[0]);
    });   
//********************************************************************************************************** */
//********************************************************************************************************** */
//**********************************РЕДАКТИРОВАНИЕ************************************************************************ */
// с помощью колбэков (требуется mysql2)
app.post("/edit", urlencodedParser, function (req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const id = req.body.id;
    pool.query("UPDATE tab1 SET name=?, age=? WHERE id=?", [name, age, id], function(err, data) {
        res.json(data);
    });
});

// с помощью промисов (требуется mysql2/promise)
app.post("/edi", urlencodedParser, function (req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const id = req.body.id;
    pool2.query("UPDATE tab1 SET name=?, age=? WHERE id=?", [name, age, id]).then(function(data) {
        res.json(data[0]);
    });
});

// с помощью async - await (требуется mysql2/promise)

app.post("/ed", urlencodedParser, async function (req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const id = req.body.id;
    let d= await pool2.query("UPDATE tab1 SET name=?, age=? WHERE id=?", [name, age, id]);
        res.json(d[0]);
    });

//********************************************************************************************************** */
//***********************************************************нужно для фронтенда*********************
//********************************************************************************************

// с помощью колбэков (требуется mysql2) получем id пользователя, получаем его из бд - отправляем json
app.get("/api/:id", function(req, res){
    const id=req.params.id;
    pool.query("SELECT * FROM tab1 WHERE id=?", [id], function(err, data) { 

        res.json(data);
    });
});

// с помощью колбэков (требуется mysql2)
app.post("/api/edit", urlencodedParser, function (req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const id = req.body.id;
    pool.query("UPDATE tab1 SET name=?, age=? WHERE id=?", [name, age, id], function(err, data) {
        res.json(data);
    });
});


// с помощью колбэков (требуется mysql2)
app.post("/delete/:id", function(req, res){
    const id = req.params.id;
    pool.query("DELETE FROM tab1 WHERE id=?", [id], function(err, data) {
        
        res.json(data);
    });
});

//***********************


app.listen(30333, function(){
    console.log("Сервер ожидает подключения...");
});