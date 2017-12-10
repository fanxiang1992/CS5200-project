// Basic Setup
var http     = require('http'),
express  = require('express'),
mysql    = require('mysql'),
parser   = require('body-parser');


//Database Connection
// var connection = mysql.createConnection({
//   host     : 'us-cdbr-iron-east-05.cleardb.net',
//   user     : 'bc25561c4d7046',
//   password : '017038aa',
//   database : 'heroku_eecbd9de5c4c545'
// });

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '',
  password : '',
  database : 'test'
});
try {
  connection.connect();
  
} catch(e) {
  console.log('Database Connetion failed:' + e);
}

// Setup express
var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/frontend',  express.static(__dirname + '/frontend'));

app.get('/',function(req,res){
    res.sendFile('index.html',{'root': __dirname + '/frontend'});
})

//getUserById
app.get('/api/user/:id', function (req,res) {
  var id = req.params.id;
  var sql = 'SELECT * FROM user left join faculty on user.user_id = faculty_id left join administrator on user.user_id = administrator.admin_id where user_id = ?';
 
  connection.query(sql, [id], function(err, rows, fields) {
      if (!err){
        var response = [];
 
      if (rows.length != 0) {
        response.push({'result' : 'success', 'data' : rows});
      } else {
        response.push({'result' : 'error', 'msg' : 'No Results Found'});
      }
 
      res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
  });
})

//getAllCourses
app.get('/api/user/:uid/courses', function (req, res) {
  var uid = req.params.uid;
  connection.query('select course.course_id, course.description, course.name, course.icon, course.cost, (enrolled.user_id is not NULL) as enrolled, (interested.user_id is not NULL) as interested from course left join user on user.user_id = ? left join enrolled on course.course_id = enrolled.course_id and user.user_id = enrolled.user_id left join interested on interested.user_id = user.user_id and interested.course_id = course.course_id', [uid], function(err, rows, fields) {
    if (!err){
        var response = [];
 
      if (rows.length != 0) {
        response.push({'result' : 'success', 'data' : rows});
      } else {
        response.push({'result' : 'error', 'msg' : 'No Results Found'});
      }
 
      res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
  });
})

app.put('/api/interestcourse', function (req,res) {
  var uid = req.body.uid;
  var cid = req.body.cid;
  var sql = 'Insert into interested (user_id, course_id) values (?, ?)';
 
  connection.query(sql, [uid, cid], function(err, rows, fields) {
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
 
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
  });
})

app.put('/api/disinterestcourse', function (req,res) {
  var uid = req.body.uid;
  var cid = req.body.cid;
  var sql = 'delete from interested where interested.user_id = ? and interested.course_id = ?';
 
  connection.query(sql, [uid, cid], function(err, rows, fields) {
      if (!err){
        var response = [];
        response.push({'result' : 'success'});
 
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } 
      else {
        res.status(400).send(err);
      }
  });
})

app.get('/api/user/:uid/mycourses', function (req, res) {
  var uid = req.params.uid;
  connection.query('SELECT COURSE.name, COURSE.course_id, ENROLLED.complete FROM USER INNER JOIN ENROLLED ON USER.user_id = ENROLLED.user_id INNER JOIN COURSE ON ENROLLED.course_id = COURSE.course_id WHERE USER.user_id = 25 ORDER BY ENROLLED.complete', [uid], function(err, rows, fields) {
    if (!err){
        var response = [];
 
      if (rows.length != 0) {
        response.push({'result' : 'success', 'data' : rows});
      } else {
        response.push({'result' : 'error', 'msg' : 'No Results Found'});
      }
 
      res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
  });
})

app.get('/api/user/:uid/myinterestedcourses', function (req, res) {
  var uid = req.params.uid;
  connection.query('SELECT COURSE.name, COURSE.course_id FROM USER INNER JOIN INTERESTED ON USER.user_id = INTERESTED.user_id INNER JOIN COURSE ON COURSE.course_id = INTERESTED.course_id WHERE USER.user_id = ?', [uid], function(err, rows, fields) {
    if (!err){
        var response = [];
 
      if (rows.length != 0) {
        response.push({'result' : 'success', 'data' : rows});
      } else {
        response.push({'result' : 'error', 'msg' : 'No Results Found'});
      }
 
      res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
      } else {
        res.status(400).send(err);
      }
  });
})



// Create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});

