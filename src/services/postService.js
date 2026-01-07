import slugify from "slugify";
import { prisma } from "../db/client.js";

export const getAllPosts = async (includeUnpublished = false) => {
    const where = includeUnpublished ? {} : { published: true };
    return await prisma.post.findMany({
        where,
        include: { category: true, author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
    });
};

export const getPostById = async (id) => {
    return await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { category: true, author: { select: { id: true, name: true, email: true } } },
    });
};

export const createPost = async ({ title, description, content, categoryId, authorId }) => {
    const slug = slugify(title, { lower: true, strict: true });

    return await prisma.post.create({
        data: {
            title,
            description,
            content,
            slug,
            categoryId,
            authorId,
        },
        include: {
            category: true,
            author: { select: { id: true, name: true, email: true } },
        },
    });
};

export const updatePost = async (id, data) => {
    // prevent slug collision if title changed
    if (data.title) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }

    return await prisma.post.update({
        where: { id: Number(id) },
        data,
        include: { category: true, author: { select: { id: true, name: true, email: true } } },
    });
};

export const deletePost = async (id, hard = false) => {
    if (hard) {
        return await prisma.post.delete({ where: { id: Number(id) } });
    }

    // soft delete / hide
    return await prisma.post.update({
        where: { id: Number(id) },
        data: { published: false },
    });
};
