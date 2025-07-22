import { prisma } from '../db/client.js';

export const getAllPosts = async (req, res) => {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
};

export const getPostBySlug = async (req, res) => {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    res.json(post);
};
