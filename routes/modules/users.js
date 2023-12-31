// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')  

// 引用  models
const db = require('../../models')
const User = db.User



router.get('/login', (req, res) => {
  const userInput = req.session.userInput || {}
  delete req.session.userInput

  res.render('login', { email: userInput.email, password: userInput.password })
})

router.post('/login', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  req.session.userInput = { email, password } // 存儲使用者輸入的值
  next()
},passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
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


router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

// 匯出路由模組
module.exports = router