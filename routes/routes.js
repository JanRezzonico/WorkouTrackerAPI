const express = require('express');
const Session = require('../models/Session.js');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const router = express.Router();

//#region User
router.get('/user', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/user/:id', async (req, res) => {
    try {
        const users = await User.findById(req.params.id);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json("a");
    }
});
router.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
//#endregion

//#region Session

router.get('/session', async (req, res) => {
    try {
        const session = await Session.find({});
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/session/:id', async (req, res) => {
    try {
        const session = await Session.find({ user_id: req.params.id });
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/session', async (req, res) => {
    try {
        let newSession = await Session.create(req.body);
        const session = new Session(newSession);
        await session.save();
        res.status(201).json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

//#endregion


//#region Auth (Register and Login)
// Define a route for user registration
router.post('/register', async (req, res) => {
    try {
        // Get the user input from the request body
        const { password } = req.body;

        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;

        // Store the hashed password in the database
        try {
            let newUser = await User.create(req.body);
            const user = new User(newUser);
            await user.save();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        // Send a response indicating success
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define a route for user login
router.post('/login', async (req, res) => {
    try {
        // Get the user input from the request body
        const { username, password } = req.body;

        // Retrieve the hashed password from the database
        let user;
        try {
            user = await User.findOne({ username: username });
        } catch (err) {
            console.error(err);
            res.status(500).json("Error");
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Passwords match - send a success response
            res.status(200).json({ message: 'Login successful' });
        } else {
            // Passwords don't match - send an error response
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//#endregion
module.exports = router;

























// //Post Method
// router.post('/post', async (req, res) => {
//     const data = new Model({
//         name: req.body.name,
//         age: req.body.age
//     })

//     try {
//         const dataToSave = data.save();
//         res.status(200).json(dataToSave)
//     }
//     catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })

// //Get all Method
// router.get('/getAll', async (req, res) => {
//     try{
//         const data = await Model.find();
//         res.json(data)
//     }
//     catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

// //Get by ID Method
// router.get('/getOne/:id', async (req, res) => {
//     try{
//         const data = await Model.findById(req.params.id);
//         res.json(data)
//     }
//     catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

// //Update by ID Method
// router.patch('/update/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const updatedData = req.body;
//         const options = { new: true };

//         const result = await Model.findByIdAndUpdate(
//             id, updatedData, options
//         )

//         res.send(result)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })

// //Delete by ID Method
// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await Model.findByIdAndDelete(id)
//         res.send(`Document with ${data.name} has been deleted..`)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })