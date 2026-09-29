const express = require('express'); // Loading the libary to handle http route
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // This is used to parse json request
const app = express(); // creating an app express
const port = 3001; //A port number where our service would run


app.use(bodyParser.json());

mongoose.connect('mongodb://mongo:27017/users')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', UserSchema);

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
})

app.post('/users', async (req, res) => {
    const {name, email} = req.body;

    try {
        const user = new User({name, email});
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("Error saving: ", error);
        res.status(500).json({error: "Internal server error"});
        
    }
})

//Defining the route
app.get('/', (req,res) => {
    res.send('Hello World')
})

//Starting the server
app.listen(port, () => {
    console.log(`User Service listening on port ${port}`);
})