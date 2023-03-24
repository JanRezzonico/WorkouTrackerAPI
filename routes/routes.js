const express = require('express');
const Session = require('../models/Session.js');
const User = require('../models/User.js');
const MongoClient = require('mongodb').MongoClient;

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
router.post('/user', async (req, res) => {
    try {
        let newUser = await User.create(req.body);
        const user = new User(newUser);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
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