const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

const api = 'api';
app.get(`/${api}/blocks`, (req, res) => {
    res.json(blockchain.chain);
});

app.post(`/${api}/mine`, (req, res) => {
    console.log(req.body);
    const {data} = req.body;
    blockchain.addBlock({data});
    res.redirect(`/${api}/blocks`);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`App listening on localhost:${PORT}`));
