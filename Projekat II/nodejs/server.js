require('dotenv');

const express = require('express');
const app = express();
const env = process?.env;

const PORT = env['PORT'] | 8080;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post('/test', async(req, res) => {
    console.log(req.body);
    return res.send({ "message": "OK!" });
});

app.listen(PORT, ()=>{
    console.log(`Nodejs listening on ${PORT}!`);
});