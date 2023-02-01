const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

//Create a brand
const createbrand = asyncHandler(async (req, res) => {
  try {
    const newbrand = await Brand.create(req.body);
    res.json(newbrand);
  } catch (error) {
    throw new Error(error);
  }
});

//Update a brand
const updatebrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatebrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatebrand);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a brand
const deletebrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletebrand = await Brand.findByIdAndDelete(id);
    res.json(deletebrand);
  } catch (error) {
    throw new Error(error);
  }
});


//Get a brand
const getbrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getbrand = await Brand.findById(id);
    res.json(getbrand);
  } catch (error) {
    throw new Error(error);
  }
});

//Get all brand
const getallbrand = asyncHandler(async (req, res) => {
  try {
    const getallbrand = await Brand.find();
    res.json(getallbrand);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = { createbrand, updatebrand, deletebrand, getbrand, getallbrand };
