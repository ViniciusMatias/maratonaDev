const express = require("express");
const serve = express()
//Configurar meu server para apresentar arquivos extras
serve.use(express.static("public"));
//Habilitar o body
serve.use(express.urlencoded({
    extended:true
}))
//Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password:'123456',
    host:'localhost',
    port: 5432,
    database: 'doe'
})
//Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: serve,
    noCache:true
})
//configurar apresentação da pagina
serve.get('/', function(req, res){
    db.query("SELECT * from donors", function(err, result){

        if(err) return res.send("erro no banco de dados.")

        const donors = result.rows;
        return res.render("index.html",{ donors })

    })
})

serve.post('/', function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood 

    if(name == "" || email == "" || blood ==""){
        return res.send("Precisa de todos os dados")
    } 

    const query = `INSERT INTO donors ("name" , "email" , "blood")
                    VALUES ($1, $2, $3)`

    const values = [name , email , blood]
    db.query(query, values, function(err){
        //fluxo de erro
        if(err) return res.send("Erro no banco de dados")
        //Fluxo real
        return res.redirect("/")
    })

})


// inicializando o servidor na porta 3000
serve.listen(3000)