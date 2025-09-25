import * as categoryService from "../services/categoryService.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getCategory = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const create = async (req, res) => {
    try {
        const newCategory = await categoryService.createCategory(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const update = async (req, res) => {
    try {
        const updated = await categoryService.updateCategory(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const remove = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}