// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用  models
const db = require('../../models')
const Todo = db.Todo
const User = db.User


router.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

router.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router
