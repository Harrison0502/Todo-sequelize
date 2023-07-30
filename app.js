const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('index')
app.get('/users/login', (req, res) => {
  res.render('login')
})
app.post('/users/login',(req,res)=>{
  res.redirect('/')
  console.log('login')
})
app.get('/users/register', (req, res) => {
  res.render('register')
})
app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})


app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})