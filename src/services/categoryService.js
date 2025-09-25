import { prisma } from "../db/client.js";

/**
 * Category Service
 * This service handles business logic related to categories.
 */
export const getAllCategories = async () => {
    return await prisma.category.findMany();
}

/**
 * Get category by ID
 * @param {Number} id - Category ID
 */
export const getCategoryById = async (id) => {
    return await prisma.category.findUnique({
        where: { id: Number(id) },
    });
}

/**
 * Create a new category
 * @param {Object} categoryData - Data for the new category
 * @return {Object} - Created category
 */
export const createCategory = async (categoryData) => {
    return await prisma.category.create({
        data: categoryData,
    });
}

/**
 * Update an existing category
 * @param {Number} id - Category ID
 * @param {Object} categoryData - Data to update the category
 * @returns {Object} - Updated category
 */
export const updateCategory = async (id, categoryData) => {
    return await prisma.category.update({
        where: { id: Number(id) },
        data: categoryData,
    });
}

/**
 * Delete a category
 * @param {Number} id - Category ID
 * @returns {Object} - Deleted category
 */
export const deleteCategory = async (id) => {
    return await prisma.category.delete({
        where: { id: Number(id) },
    });
}
