const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

// Create a Color
const createcolor = asyncHandler(async (req, res) => {
  try {
    const newcolor = await Color.create(req.body);
    res.json(newcolor);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Color
const updatecolor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatecolor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatecolor);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Color
const deletecolor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecolor = await Color.findByIdAndDelete(id);
    res.json(deletecolor);
  } catch (error) {
    throw new Error(error);
  }
});


// Get a Color
const getcolor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getcolor = await Color.findById(id);
    res.json(getcolor);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all Color
const getallcolor = asyncHandler(async (req, res) => {
  try {
    const getallcolor = await Color.find();
    res.json(getallcolor);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = { createcolor, updatecolor, deletecolor, getcolor, getallcolor };
