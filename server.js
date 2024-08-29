const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const app = require('./app')

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
}).then(function (conn) {
    // conn is a connection object
    //console.log(conn)
    console.log("DB connection successful")
}).catch(function (err) {
    console.log(err.message);
})

const port = process.env.PORT || 3001;
const server = app.listen(port, function () {
    console.log('Server has started on port',port)
})



