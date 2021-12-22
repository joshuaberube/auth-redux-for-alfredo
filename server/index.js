require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const { editUser, getUserSession, loginUser, logoutUser, registerUser } = require('./controllers/authController.js')
const { checkSession } = require('./middleware.js')

const app = express()

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

app.use(express.json())

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
})
  .then((db) => {
    app.set('db', db);
    console.log('Connected to database!');
  })
  .catch((err) => console.log(err));


app.post('/api/user/register', registerUser)
app.post('/api/user/login', loginUser)
app.post('/api/user/update', checkSession, editUser)
app.post('/api/user/logout', checkSession, logoutUser)
app.post('/api/user/session', checkSession, getUserSession)


app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}.`))