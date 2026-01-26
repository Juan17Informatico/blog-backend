import * as categoryService from "../services/categoryService.js";
import { asyncHandler, AppError } from "../utils/errorHandler.js";

/**
 * Obtiene todas las categorías
 * GET /api/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    
    if (!categories || categories.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No hay categorías disponibles",
            data: []
        });
    }

    res.status(200).json({
        success: true,
        data: categories
    });
});

/**
 * Obtiene una categoría por ID
 * GET /api/categories/:id
 */
export const getCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    
    if (!category) {
        throw new AppError(
            'Categoría no encontrada',
            404,
            'NotFoundError'
        );
    }

    res.status(200).json({
        success: true,
        data: category
    });
});

/**
 * Crea una nueva categoría
 * POST /api/categories
 */
export const create = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        throw new AppError(
            'El nombre de la categoría es obligatorio',
            400,
            'ValidationError',
            ['Verifica el campo requerido: name']
        );
    }

    const newCategory = await categoryService.createCategory(req.body);
    
    res.status(201).json({
        success: true,
        message: "Categoría creada exitosamente",
        data: newCategory
    });
});

/**
 * Actualiza una categoría existente
 * PUT /api/categories/:id
 */
export const update = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        throw new AppError(
            'El nombre de la categoría es obligatorio',
            400,
            'ValidationError',
            ['Verifica el campo requerido: name']
        );
    }

    const updated = await categoryService.updateCategory(req.params.id, req.body);
    
    if (!updated) {
        throw new AppError(
            'Categoría no encontrada',
            404,
            'NotFoundError'
        );
    }

    res.status(200).json({
        success: true,
        message: "Categoría actualizada exitosamente",
        data: updated
    });
});

/**
 * Elimina una categoría
 * DELETE /api/categories/:id
 */
export const remove = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    
    res.status(204).end();
});