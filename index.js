const express = require("express");
const res = require("express/lib/response");
const app = express();
const bodyParser = require('body-parser');
const connection =  require('./database/database')
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');


//database
connection.
  authenticate()
  .then(() => {
      console.log('Conexão com o banco realizada com sucesso');
  })
  .catch((msgErro) => {
      console.log('Ocorreu uma falha na conexão');
  })


//ejs
app.set('view engine','ejs');
app.use(express.static('public'));

//bodyparser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//rotas
app.get('/',(req,res) => {
  Pergunta.findAll({ raw : true,order:[
      ['id','DESC']
  ]}).then(perguntas => {
      res.render('index', {
          perguntas:perguntas
      });
   
  });

});

app.get('/perguntar', (req,res) => {
    res.render("perguntar");

});

app.post('/receberpergunta', (req,res) => {
    var título = req.body.titulo;
    var descricao = req.body.descricao;
    
    Pergunta.create({
        titulo: título,
        descricao: descricao
    }).then(() => {
      res.redirect('/');
    })
});

app.get('/pergunta/:id',(req,res) => {

    var id = req.params.id;
    Pergunta.findOne({
        where: {id:id}    
    }).then(pergunta => {
        if(pergunta != undefined){
      Resposta.findAll({
          where: {perguntaId:pergunta.id },
          order: [['id','DESC']]
      }).then(respostas => {
        res.render('pergunta',{
            pergunta:pergunta,
            respostas:respostas
        });
      }); 
        }else{
      res.redirect('/');
        }
    });

});

app.post('/responder',(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo:corpo,
        perguntaId: perguntaId
    }).then(() => {
     res.redirect('/pergunta/'+perguntaId);
    });


});




app.listen(2001,function(erro){
    if(erro){
        console.log('Ocorreu um problema');
    }else{
        console.log('Servidor iniciado com sucesso!')
    }
});





