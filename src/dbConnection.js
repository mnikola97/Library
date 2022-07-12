const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var con = mysql.createConnection({
host: "localhost",
user: "pma",
database: "biblioteka",
port:3306
});


const app = express(); 
app.use(express.json());

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
    if (token == null) return res.redirect(301, '/login');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {   
        console.log(user);
        if (err) return res.redirect(301, '/login');   
        req.user = user;   
        next();
    });
}

//or single

    app.post('/add_book',(req,res)=>{

    let {bookname,author} = req.body;
    console.log(bookname+" "+author);

    if(!bookname) return res.status(400).json('Book Name cant be blank');
    if(!author) return res.status(400).json('Author cant be blank');

    var data={bookname:bookname,
                author:author};

                var sql = "Select * from knjige";
                 var query;
               var query = con.query(sql, function (err, result) {
                    if (err) throw err;
                    res.json(result);
                });
                 
    });

    app.post('/login',(req,res)=>{

        let {korisnicko,lozinka} = req.body;
    
        if(!korisnicko) return res.status(400).json('Unesite korisnicko ime');
        if(!lozinka) return res.status(400).json('Unesite lozinku');
        var sql = "Select * from administratori where korisnicko_ime= '"+korisnicko+"'";
        var query;
        let saltRounds=10;
        var query = con.query(sql, function (err, result) {
            if (err) throw err;
            if(result.length!==0){
                bcrypt.compare(lozinka,result[0]['sifra'],function(err,uspesno){
                if(err) throw err;
                const obj = {
                    userId: result[0].Id,
                    user: result[0].korisnicko_ime
                    };
                const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);
                if(uspesno) res.json({"uspesno":true,"vlasnik":result[0]['vlasnik'], token: token });
                else res.json({"uspesno":false});
                });
            }                       
        });               
    });

        app.post('/sacuvajAdmina',(req,res)=>{
            var sql;
            let {korisnicko,lozinka,admin} = req.body;
            let saltRounds=10;
            bcrypt.hash(lozinka,saltRounds).then(function(result){
                sql = "Insert into administratori (korisnicko_ime,sifra,vlasnik) values('"
                +korisnicko+"','"+result+"',"+admin+")";
                  }).then(function(){   
                       var query = con.query(sql, function (err, result) {
                            if (err) throw err;
                            else res.json({"uspesno":true});    
                        });
                    });
                         
            });

            app.post('/napraviPozajmicu',(req,res)=>{
                var sql;
                let {jmbg,id_knjige} = req.body;
                let d = new Date();
                let datum = d.setDate(d.getDate()+15);
                let datumNovi = new Date(datum);
                sql = "Insert into pozajmice (id_knjige,jmbg_korisnika,datum_vracanja)"+
                " values('"+id_knjige+"','"+jmbg+"','"+datumNovi.toISOString().split('T')[0]+"')"; 
                           var query = con.query(sql, function (err, result) {
                                if (err) throw err;
                                else res.json({"uspesno":true});    
                            });             
                });

            app.post('/produziClanarinu',(req,res)=>{
                let sql;
                let {Istek_clanarine,jmbg} = req.body;
                    let NoviDatum = new Date(Istek_clanarine);
                    let dat= NoviDatum.toISOString().split('T')[0];
                    sql = "Update korisnici SET Istek_clanarine = '"+dat+"' where JMBG = '"+jmbg+"'";
                    var query = con.query(sql, function (err, result) {
                         if (err) throw err;
                         else res.json({"uspesno":true,'novDatum':dat});    
                    })
            });

            app.post('/sacuvajKnjigu',(req,res)=>{
                let sql;
                let {naziv,autor,izdavac,kolicina} = req.body;
                let sql1 = "select * from knjige where naziv = '"+naziv+"' and autor = '"+autor+"' and izdavac = '"+izdavac+"'";
                var query = con.query(sql1, function (err, result) {
                    if (err) throw err;
                    else if(result.length>0){
                        sql = "Update knjige SET kolicina = '"+parseInt(result[0]['kolicina'])+parseInt(kolicina)+
                        "' where naziv = '"+naziv+"' and autor = '"+autor+"' and izdavac = '"+izdavac+"'";
                    }
                    else {
                        sql = "Insert into knjige (naziv,autor,izdavac,kolicina) values('"+naziv+
                        "','"+autor+"','"+izdavac+"'"+kolicina+")";

                    }   
                    var query = con.query(sql, function (err, result) {
                        if (err) throw err;
                        else res.json({"uspesno":true});    
                    });
                });
            });

            app.post('/excelKnjige',(req,res)=>{
                let sql='';
                let niz = req.body;
                console.log(niz);
                niz=niz.filter(x=>x.Naslov!=='');
                sql="Insert into knjige (naziv,autor,izdavac,kolicina) values('"+niz[0].Naslov+
                "','"+niz[0].Autor+"','"+niz[0].Izdavac+"'"+niz[0].Kolicina+"),";
                niz=niz.splice(0,1);
                niz.forEach(x=>{ sql += "values('"+x.Naslov+
                        "','"+x.Autor+"','"+x.Izdavac+"'"+x.Kolicina+")";

                    })   
                    var query = con.query(sql, function (err, result) {
                        if (err) throw err;
                        else res.json({"uspesno":true});    
                    });
                    console.log(sql);
                });


                        
                        app.post('/novClan',(req,res)=>{
                            let sql;
                            let {imePrezime,telefon,email,jmbg} = req.body;
                            let datum = new Date();
                            datum.setDate(datum.getDate()+30);
                            let istek=datum.toISOString().split('T')[0];
                                sql = "Insert into korisnici (Ime_Prezime,kontakt_telefon,email,JMBG,istek_clanarine)" +
                                "values('"+imePrezime+"','"+telefon+"','"+email+"','"+jmbg+"','"+istek+"')";
                                var query = con.query(sql, function (err, result) {
                                    if (err) throw err;
                                    else res.json({"uspesno":true});    
                                });
                        });   

                         app.post('/getClanovi',(req,res)=>{
                        let sql;
                        let {JMBG} = req.body;
                            sql = "select * from korisnici where JMBG like '%"+JMBG+"%'";
                                   var query = con.query(sql, function (err, result) {   
                                            if (err) throw err;
                                            else res.json({"uspesno":true, 'clanovi':result});   
                                    });
                                }); 

            app.post('/getKnjige',(req,res)=>{
            let sql;
            sql = "select * from  dostupne_knjige";
            var query = con.query(sql, function (err, result) {   
                if (err) throw err;
                else res.json({"uspesno":true, 'knjige':result});   
                });
            });   

            app.post('/getPozajmice',(req,res)=>{
                let sql;
                sql = "select * from pozajmljene_knjige";
                var query = con.query(sql, function (err, result) {   
                    if (err) throw err;
                    else res.json({"uspesno":true, 'pozajmice':result});   
                    });
            }); 

                app.post('/obrisiPozajmicu',(req,res)=>{
                    let sql;
                    let {id} = req.body;
                    sql = "Delete from pozajmice where id = '"+id+"'";
                    var query = con.query(sql, function (err, result) {
                        if (err) throw err;
                        else res.json({"uspesno":true});   
                        });
                    });


            app.get('/', authToken, (req, res) => {
                res.json({ "uspesno":true,"vlasnik":+result[0]['vlasnik']});
            });


        app.listen(3000, ()=> {
    console.log(`app is running on port 3000`);
});