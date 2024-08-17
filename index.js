const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('hello mate');
})

// Routes
const authRouter = require('./src/auth/authRouter')
const productRouter = require('./src/product/productRouter');

app.use('/auth', authRouter);
app.use('/api', productRouter);

// database
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log(`database connected to ${mongoUri}`);
})

// express listener 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is runnig on port: ${port}`)
});