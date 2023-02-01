const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

// Create a Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deleteEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});


// Get a Enquiry
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getEnquiry = await Enquiry.findById(id);
    res.json(getEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all Enquiry
const getallEnquiry = asyncHandler(async (req, res) => {
  try {
    const getallEnquiry = await Enquiry.find();
    res.json(getallEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getallEnquiry };
