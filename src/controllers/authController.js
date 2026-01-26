import AuthService from "../services/authService.js";
import { asyncHandler, AppError } from "../utils/errorHandler.js";

/**
 * Registra un nuevo usuario
 * POST /api/auth/register
 */
export const registerUser = asyncHandler(async (req, res, next) => {
    const userData = req.body;

    // Validar campos requeridos
    if (!userData.email || !userData.password || !userData.name) {
        throw new AppError(
            'Email, contraseña y nombre son obligatorios',
            400,
            'ValidationError',
            ['Verifica los campos requeridos: email, password, name']
        );
    }

    const newUser = await AuthService.register(userData);
    res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: newUser,
    });
});

/**
 * Inicia sesión de un usuario
 * POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError(
            'Email y contraseña son obligatorios',
            400,
            'ValidationError',
            ['Verifica los campos requeridos: email, password']
        );
    }

    const loginResult = await AuthService.login({ email, password });

    res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: loginResult,
    });
});

/**
 * Genera un nuevo token para un usuario
 * POST /api/auth/refresh-token
 */
export const getNewToken = asyncHandler(async (req, res, next) => {
    const user = req.body;

    if (!user || !user.id) {
        throw new AppError(
            'Usuario inválido',
            400,
            'ValidationError',
            ['Se requiere información válida del usuario']
        );
    }

    const newToken = await AuthService.generateToken(user);

    res.status(200).json({
        success: true,
        message: "Token generado exitosamente",
        data: newToken,
    });
});
