import express from 'express'

const app = express()
const port = 3432

app.set('view engine', 'pug')
app.set('views', './public/views')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`listening on http://127.0.0.1:${port}`)
})