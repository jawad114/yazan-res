const express = require('express');
const router = express.Router();
const {
    getAllResturant,
    getResturantById,
    addNewResturant,
    updateResturant,
    deleteResturantById
} = require("./Controllers/ResturantController");

//--------------------------------------
// Get all contacts
router.get("/", getAllResturant);

//--------------------------------------
// Get a contact by id
router.get("/:id", getResturantById);

//--------------------------------------
// Add new contact
router.post("/", addNewResturant);
//--------------------------------------
// Update contact
router.put("/:id", updateResturant);
//--------------------------------------
// Delete contact by id
router.delete("/:id", deleteResturantById);

module.exports = router;
