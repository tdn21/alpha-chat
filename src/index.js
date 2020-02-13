const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

app.listen(PORT, () => {
    console.log(`app is running at port ${PORT}`)
})
