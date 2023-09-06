const express = require("express");
const router = express.Router();
const MessageModel = require("../Model/Message.model");

// Route for sending a message
router.post("/send", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      content,
      senderId,
      receiverId,
      isDelivered,
      isSeen,
      timeOfDelivery,
      timeOfSeen,
    } = req.body;

    // Create a new message instance
    const newMessage = new MessageModel({
      content,
      senderId,
      receiverId,
      isDelivered,
      isSeen,
      timeOfDelivery,
      timeOfSeen,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage); // Return the saved message
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getMessages", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    console.log(senderId, receiverId);

    const messages = await MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the 'isSeen' property of a message by ID
router.patch("/updateSeen/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await MessageModel.findByIdAndUpdate(
      messageId,
      { isSeen: true, timeOfSeen: new Date() },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    console.log('update seen', messageId);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all messages
router.get("/getAllMessages", async (req, res) => {
  try {
    // Fetch all messages from the database
    const messages = await MessageModel.find({});

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete all chats between senderId and receiverId
router.delete("/deleteChats/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Delete all messages where senderId and receiverId match
    await MessageModel.deleteMany({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json({ message: "Chats deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
