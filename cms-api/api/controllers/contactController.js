const createError = require('http-errors');
const mongoose = require('mongoose');

const Contact = require('../models/contactModel');

module.exports = {

  getAllContacts: async (req, res, next) => {
    try {
      const results = await Contact.find({}, { __v: 0 });
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewContact: async (req, res, next) => {
    try {
      const contact = new Contact(req.body);
      const result = await contact.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findContactById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const contact = await Contact.findById(id);
      if (!contact) {
        throw createError(404, 'Contact does not exist.');
      }
      res.send(contact);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Contact id'));
        return;
      }
      next(error);
    }
  },

  updateAContact: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };

      const result = await Contact.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'Contact does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Contact Id'));
      }

      next(error);
    }
  },

  deleteAContact: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Contact.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, 'Contact does not exist.');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Contact id'));
        return;
      }
      next(error);
    }
  }
};