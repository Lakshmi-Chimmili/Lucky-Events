const mongoose = require('mongoose');
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ basePricePerAttendee: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID, name, or preset
// @route   GET /categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let category = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await Category.findById(id);
    }

    if (!category) {
      category = await Category.findOne({
        $or: [
          { name: id },
          { name: new RegExp(`^${id}$`, 'i') },
        ],
      });
    }

    if (!category) {
      const presetCategoryMap = {
        '6ab51674725d99e2dadd0e26': 'Birthday Party',
        '6ab51674725d99e2dadd0e27': 'Wedding/Marriage',
        '6ab51674725d99e2dadd0e28': 'Corporate/Professional',
        '6ab51674725d99e2dadd0e29': 'Family Function',
        '6ab51674725d99e2dadd0e2a': 'Festival & Cultural Celebration',
        '6ab51674725d99e2dadd0e2b': 'Anniversary & Engagement',
        '6ab51674725d99e2dadd0e2c': 'Concert & Stage Show',
        '6ab51674725d99e2dadd0e2d': 'Baby Shower & Naming Ceremony',
      };
      const name = presetCategoryMap[id];
      if (name) {
        category = await Category.findOne({ name });
      }
    }

    if (!category) {
      category = await Category.findOne({ isActive: true });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, basePricePerAttendee, isActive } = req.body;

    if (!name || basePricePerAttendee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Category name and base price per attendee are required.',
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists.',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
      image: image || undefined,
      basePricePerAttendee: Number(basePricePerAttendee),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, basePricePerAttendee, isActive } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (basePricePerAttendee !== undefined) category.basePricePerAttendee = Number(basePricePerAttendee);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    const updated = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
