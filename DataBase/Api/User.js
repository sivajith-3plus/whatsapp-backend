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

// Block a user
router.put('/block/:userId/:chatMateId', async (req, res) => {
  try {
    const currentUserId = req.params.userId; 
    const currentUser = await userModel.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userIdToBlock = req.params.chatMateId;
    if (currentUser.blockedUsers.includes(userIdToBlock)) {
      return res.status(400).json({ error: 'User is already blocked' });
    }

    currentUser.blockedUsers.push(userIdToBlock);

    await currentUser.save();

    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/unblock/:userId/:chatMateId', async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    console.log('hii',currentUserId,req.params.chatMateId);
    const currentUser = await userModel.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userIdToUnblock = req.params.chatMateId;

    if (!currentUser.blockedUsers.includes(userIdToUnblock)) {
      return res.status(400).json({ error: 'User is not blocked' });
    }

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (blockedUserId) => blockedUserId.toString() !== userIdToUnblock
    );

    await currentUser.save();

    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
