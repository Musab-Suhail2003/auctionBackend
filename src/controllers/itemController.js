const itemModel = require('../models/itemModels');

class ItemController {
  async getAllItems(req, res) {
    try {
      const items = await itemModel.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getItem(req, res) {
    try {
      const item = await itemModel.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoriesbyID(req, res) {
    try {
      const category = await itemModel.getCategorybyID(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Categories not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAllCategories(req, res) {

    console.log('inside get all category controller');
    try {
      const result = await itemModel.allCategories();
      if (!result) {
        return res.status(404).json({ message: 'Categories not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserItems(req, res) {
    try {
      const item = await itemModel.findAllFromUser(req.params.user_id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createItem(req, res) {
    try {
      const item = await itemModel.create(req.body, req.body.images);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ItemController();