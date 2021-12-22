const { hash, compare } = require('bcrypt')
require('dotenv').config()

const registerUser = async (req, res) => {
  try {
    const db = req.app.get('db')
    const { email, password } = req.body

    const [foundEmail] = await db.user.check_email(email)
    if (foundEmail) return res.status(401).send('Email already in use')

    const hashedPass = await hash(password, 10)
    req.body.password = hashedPass

    const [newUser] = await db.user.register_user(req.body)
    await db.user.insert_default_resources(newUser.user_id)

    newUser.api_key = false
    req.session.user = newUser

    return res.status(200).send(req.session.user)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
}

const loginUser = async (req, res) => {
  try {
    const db = req.app.get('db')
    const { email, password } = req.body
  
    const [foundUser] = await db.user.check_email(email);
    if (!foundUser) return res.status(401).send('Invalid email or password');
  
    const passwordCheck = await compare(password, foundUser.password)
    if (!passwordCheck) return res.status(401).send('Invalid email or password.')
  
    delete foundUser.password
    foundUser.api_key = foundUser.api_key ? true : false
  
    req.session.user = foundUser
    return res.status(200).send(req.session.user)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
}

const editUser = async (req, res) => {
  const db = req.app.get('db')
  const { user_id } = req.session.user

  req.body.user_id = user_id
  const [updatedUser] = await db.user.edit_user(req.body)
  .catch((err) => {console.log(err); res.sendStatus(400) })

  req.session.user = updatedUser;
  res.status(200).send(req.session.user);
}

const logoutUser = async (req, res) => {
  req.session.destroy()
  res.sendStatus(200)
}

const getUserSession = async (req, res) => {
  const db = req.app.get('db')
  const { user_id } = req.session.user

  const [currentUser] = await db.user.check_user_id(user_id)

  currentUser ? res.status(200).send(req.session.user)
  : res.status(404).send('Please login')
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserSession,
  editUser
}
