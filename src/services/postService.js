import prisma from "../prisma/client.js";

export const getAllPosts = async () => {
    return await prisma.post.findMany({
        include: { category: true },
    });
};

export const getPostById = async (id) => {
    return await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { category: true },
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
    return await prisma.post.update({
        where: { id: Number(id) },
        data,
        include: { category: true },
    });
};

export const deletePost = async (id) => {
    return await prisma.post.delete({
        where: { id: Number(id) },
    });
};
