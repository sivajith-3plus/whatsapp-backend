const express = require('express');
const router = express.Router();
const userModel = require('../Model/User.model');

router.get('/getAll', async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put("/updateUserData", async (req, res) => {
  console.log('hii');
  try {
    const { updatedUser } = req.body;

    const updatedUserData = await userModel.findByIdAndUpdate(
      updatedUser._id, 
      updatedUser,
      { new: true } 
    );

    if (!updatedUserData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ updatedUser: updatedUserData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
