const app = require('./app')
const cors = require('cors')



// const insertQuery = 'INSERT INTO users (name,id) VALUES ($1,$2)'
// app.post('/insert', (req, res) => {
//     const { name, id } = req.body
//     con.query(insertQuery, [name, id], (err, result) => {
//         if (err) {

//             res.send(err)
//         }
//         else {
//             console.log(result);
//             res.send('Post Data')
//         }
//     })
// })
app.use(cors({
    origin: "http://localhost:5173/",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true

}))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log('SERVER STARTED');
})
