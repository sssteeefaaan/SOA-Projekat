require('dotenv');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const express = require('express');
const app = express();
const env = process?.env;

const PORT = env['PORT'] | 8080;

const PROTO_PATH = __dirname + '/protos/notifications.proto';

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
const not_stub = new protoDescriptor.notifications.Notifications(env['GRPC_URL'], grpc.credentials.createInsecure());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post('/test', async(req, res) => {
    try{
        console.log(req.body);
        not_stub.send({
            id:"123",
            sender: "123",
            receiver: "123",
            payload: JSON.stringify(req.body),
            date: '123'
        }, (err, response)=>{
            if(err)console.log(err);
            else console.log(response);
        });
        return res.send({ "message": "OK!" });
    }
    catch(e){
        console.log(e);
        return res.status(500).send({"error": e});
    }
});

app.listen(PORT, ()=>{
    console.log(`Nodejs listening on ${PORT}!`);
});