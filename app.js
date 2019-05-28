const express = require('express');
const app = express();
const db = require('./public/db/conn');
const bodyParser = require('body-parser');
const mailer = require('express-mailer');

app.set('views',__dirname + '/views');
app.set('view_engine', 'ejs');


app.use(express.static('public'));
//Requiriendo rutas
const routes = require('./routes');


app.get(db);
app.use(bodyParser.urlencoded({extended:true}));
app.use(routes);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
  module.exports= mailer;