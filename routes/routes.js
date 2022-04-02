const express = require('express')
const router = express.Router()
const db = require('../db/index')
module.exports = router

router.get('/', (req, res) => {
  res.send('Active')
})
