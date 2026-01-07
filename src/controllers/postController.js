import * as postService from "../services/postService.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostsAdmin = async (req, res) => {
    try {
        const posts = await postService.getAllPosts(true);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // If post is unpublished, allow only the author or admins to view
        if (!post.published) {
            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(404).json({ error: "Post not found" });
            try {
                const token = authHeader.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.role === "admin" || decoded.userId === post.authorId) {
                    return res.json(post);
                }
                return res.status(404).json({ error: "Post not found" });
            } catch (err) {
                return res.status(404).json({ error: "Post not found" });
            }
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newPost = await postService.createPost({ ...req.body, authorId: req.user.userId });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (req.user.userId !== post.authorId && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const updated = await postService.updatePost(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (req.user.userId !== post.authorId && req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const hard = req.query.hard === "true";
        await postService.deletePost(req.params.id, hard);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
