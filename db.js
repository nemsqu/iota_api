var mysql = require('mysql');
require('dotenv').config();

//define parameters for connecting to the database
var con = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "mydb"
});

con.connect(function(err){
    if (err) throw err;
    console.log("Connected to database");
});

function createStakeholderInfoTable(){
    var sql = "CREATE TABLE IF NOT EXISTS stakeholders_information (CVR_Number VARCHAR(255), DID VARCHAR(255) )";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("stakeholder_information table exists or created");
    }); 
}

function addStakeholderInfo(cvr, did){
    var sql = `INSERT INTO stakeholders_information (CVR_number, DID) VALUES ('${cvr}', '${did}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("recorded_ID: " + result.insertId);
    });
}

async function getStakeholderCVR(did){
    return new Promise((resolve, reject) => {
        con.query(`SELECT CVR_Number as cvr FROM stakeholders_information WHERE DID = '${did}'`, function (err, result) {
          if (err) reject(err); 
          resolve(result);
        })
      })
}

function getAllStakeholderInfo(){
    con.query("SELECT * FROM stakeholders_information ", function (err, result) {
        if (err) throw err;
        console.log(result);
    });     
}

function deleteStakeholderInfo(did){
    var sql = `DELETE FROM stakeholders_information WHERE DID = '${did}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
}

function dropStakeholderInfoTable(){
    var sql = `DROP TABLE stakeholders_information`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
}

function updateStakeholderInfo(column, value, check, checkvalue){
    var sql = `UPDATE stakeholders_information SET ${column} = '${value}' WHERE ${check} = '${checkvalue}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });     
}

function createCertificateTable(){
    var sql = "CREATE TABLE IF NOT EXISTS certificate (ID int NOT NULL AUTO_INCREMENT PRIMARY KEY, CVR_Number VARCHAR(255), Date_of_annual_inspection VARCHAR(255), product_category VARCHAR(255), Date_of_issuing VARCHAR(255), Place_of_issuing VARCHAR(255), Valid_until VARCHAR(255), Issuer VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("certificate table exists or created");
    });   
}

function addCertificate(cvr, date, category, issuedTime, issuedPlace, validity, issuer){
    //example values ' 2023-05-16 ', '34230021', 'unprocessed plant products', ' 2023-05-16 ', ' copenhagen', ' 2023-05-16 '
    var sql = `INSERT INTO certificate (CVR_Number, Date_of_annual_inspection, product_category, Date_of_issuing,Place_of_issuing ,Valid_until, Issuer) VALUES ('${cvr}', '${date}', '${category}', '${issuedTime}', '${issuedPlace}', '${validity}', '${issuer}' )`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("recorded_ID: " + result.insertId);
    });
}

function getCertificate(cvr){
    return new Promise((resolve, reject) => {
        con.query(`SELECT Date_of_annual_inspection as inspection, product_category as category, Date_of_issuing as date, Place_of_issuing as place, Valid_until as validity, Issuer as issuer FROM certificate WHERE CVR_number = '${cvr}'`, function (err, result, fields) {
          if (err) reject(err); 
          resolve(result);
        })
      })
}

function getAllCertificates(){
    con.query("SELECT * FROM certificate ", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
}
  
function deleteCertificate(cvr){
    var sql = `DELETE FROM certificate WHERE cvr_number = '${cvr}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
}

function dropCertificateTable(){
    var sql = `DROP TABLE certificate`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
}
  
function updateCertificate(cvr, date, category, issuedTime, issuedPlace, validity, issuer){
    var sql = `UPDATE certificate SET Date_of_annual_inspection='${date}', product_category='${category}', Date_of_issuing='${issuedTime}', Place_of_issuing='${issuedPlace}', Valid_until='${validity}', Issuer='${issuer}' WHERE CVR_Number = '${cvr}' )`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
}
    
module.exports = {createCertificateTable, createStakeholderInfoTable, addCertificate, addStakeholderInfo, getAllCertificates, getCertificate, getAllStakeholderInfo, getStakeholderCVR, deleteStakeholderInfo, deleteCertificate, dropCertificateTable, dropStakeholderInfoTable, updateCertificate, updateStakeholderInfo}