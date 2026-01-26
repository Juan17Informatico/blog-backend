import * as postService from "../services/postService.js";
import jwt from "jsonwebtoken";
import { asyncHandler, AppError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los posts publicados
 * GET /api/posts
 */
export const getPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getAllPosts();
    
    if (!posts || posts.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No hay posts disponibles",
            data: []
        });
    }

    res.status(200).json({
        success: true,
        data: posts
    });
});

/**
 * Obtiene todos los posts (admin incluye sin publicar)
 * GET /api/posts/admin
 */
export const getPostsAdmin = asyncHandler(async (req, res) => {
    const posts = await postService.getAllPosts(true);
    
    if (!posts || posts.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No hay posts disponibles",
            data: []
        });
    }

    res.status(200).json({
        success: true,
        data: posts
    });
});

/**
 * Obtiene un post por ID
 * GET /api/posts/:id
 */
export const getPost = asyncHandler(async (req, res, next) => {
    const post = await postService.getPostById(req.params.id);
    
    if (!post) {
        throw new AppError(
            'Post no encontrado',
            404,
            'NotFoundError'
        );
    }

    // Si el post no está publicado, solo el autor o admin pueden verlo
    if (!post.published) {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            throw new AppError(
                'Post no encontrado',
                404,
                'NotFoundError'
            );
        }

        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (decoded.role !== "admin" && decoded.userId !== post.authorId) {
                throw new AppError(
                    'Post no encontrado',
                    404,
                    'NotFoundError'
                );
            }
        } catch (err) {
            if (err instanceof AppError) throw err;
            throw new AppError(
                'Post no encontrado',
                404,
                'NotFoundError'
            );
        }
    }

    res.status(200).json({
        success: true,
        data: post
    });
});

/**
 * Crea un nuevo post
 * POST /api/posts
 */
export const create = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.userId) {
        throw new AppError(
            'Usuario no autenticado',
            401,
            'UnauthorizedError'
        );
    }

    if (!req.body.title || !req.body.content) {
        throw new AppError(
            'Título y contenido son obligatorios',
            400,
            'ValidationError',
            ['Verifica los campos requeridos: title, content']
        );
    }

    const newPost = await postService.createPost({
        ...req.body,
        authorId: req.user.userId
    });

    res.status(201).json({
        success: true,
        message: "Post creado exitosamente",
        data: newPost
    });
});

/**
 * Actualiza un post existente
 * PUT /api/posts/:id
 */
export const update = asyncHandler(async (req, res) => {
    const post = await postService.getPostById(req.params.id);
    
    if (!post) {
        throw new AppError(
            'Post no encontrado',
            404,
            'NotFoundError'
        );
    }

    if (req.user.userId !== post.authorId && req.user.role !== "admin") {
        throw new AppError(
            'No tienes permiso para actualizar este post',
            403,
            'ForbiddenError'
        );
    }

    const updated = await postService.updatePost(req.params.id, req.body);
    
    res.status(200).json({
        success: true,
        message: "Post actualizado exitosamente",
        data: updated
    });
});

/**
 * Elimina un post
 * DELETE /api/posts/:id
 */
export const remove = asyncHandler(async (req, res) => {
    const post = await postService.getPostById(req.params.id);
    
    if (!post) {
        throw new AppError(
            'Post no encontrado',
            404,
            'NotFoundError'
        );
    }

    if (req.user.userId !== post.authorId && req.user.role !== "admin") {
        throw new AppError(
            'No tienes permiso para eliminar este post',
            403,
            'ForbiddenError'
        );
    }

    const hard = req.query.hard === "true";
    await postService.deletePost(req.params.id, hard);
    
    res.status(204).end();
});
