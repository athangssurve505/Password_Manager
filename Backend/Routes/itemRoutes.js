const express = require('express');
const router = express.Router();
const WebsiteCredentials = require('../models/Item.js'); // Import the Item model

// Route to add a new item (POST request)
router.post('/', async (req, res) => {
  const { websiteName, username, password } = req.body;  // Extract data from request body

  try {
    const newItem = new WebsiteCredentials({
      websiteName,
      username,
      password,
    });

    await newItem.save(); // Save the new item to MongoDB

    res.status(201).json(newItem);  // Return the new item in the response
  } catch (err) {
    res.status(400).json({ message: err.message });  // Handle errors
  }
});

// Route to get all items (GET request)
  router.get('/data', async (req, res) => {
    try {
      const items = await WebsiteCredentials.find();  // Retrieve all items from the database
      res.status(200).json(items);  // Return the items as a response
    } catch (err) {
      res.status(400).json({ message: err.message });  // Handle errors
    }
  });

// Route to update an existing item (PUT request)
router.put('/:_id', async (req, res) => {
  const { websiteName, username, password } = req.body;  // Extract new data from request body
  const { _id } = req.params;  // Extract the item ID from the URL

  try {
    const updatedItem = await WebsiteCredentials.findByIdAndUpdate(
      _id,
      { websiteName, username, password },
      { new: true } // This returns the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);  // Return the updated item
  } catch (err) {
    res.status(400).json({ message: err.message });  // Handle errors
  }
});

// Route to delete an item (DELETE request)
router.delete('/:_id', async (req, res) => {
  const { _id } = req.params;  // Extract the item ID from the URL

  try {
    const deletedItem = await WebsiteCredentials.findByIdAndDelete(_id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });  // Return success message
  } catch (err) {
    res.status(400).json({ message: err.message });  // Handle errors
  }
}
)

// Export the router to be used in server.js
module.exports = router;
