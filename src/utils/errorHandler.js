import { Prisma } from "@prisma/client";

/**
 * Clase personalizada para errores de aplicación
 * Permite control granular de códigos de estado y mensajes de error
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, error = 'InternalServerError', details = []) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.details = details;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Mapeo de códigos de error de Prisma a mensajes amigables
 */
const PRISMA_ERROR_MAP = {
    P2002: {
        error: 'UniqueConstraintError',
        message: 'Este recurso ya existe. Por favor, verifica los datos únicos.',
        statusCode: 409
    },
    P2025: {
        error: 'NotFoundError',
        message: 'El recurso solicitado no existe.',
        statusCode: 404
    },
    P2003: {
        error: 'ForeignKeyConstraintError',
        message: 'No se puede completar la operación debido a referencias externas.',
        statusCode: 400
    },
    P2014: {
        error: 'RequiredRelationViolationError',
        message: 'No se puede eliminar este recurso porque tiene registros relacionados.',
        statusCode: 400
    }
};

/**
 * Formatea errores de Prisma a una estructura JSON estandarizada
 */
const formatPrismaError = (err) => {
    const prismaError = PRISMA_ERROR_MAP[err.code];

    if (prismaError) {
        // Obtener el campo que causó el error (para P2002)
        const details = [];
        if (err.code === 'P2002' && err.meta?.target) {
            details.push(`Campo duplicado: ${err.meta.target.join(', ')}`);
        }

        return new AppError(
            prismaError.message,
            prismaError.statusCode,
            prismaError.error,
            details
        );
    }

    // Error de Prisma desconocido
    return new AppError(
        'Error en la base de datos',
        500,
        'DatabaseError',
        [err.message]
    );
};

/**
 * Middleware global de manejo de errores
 * Debe ser registrado al final de todas las rutas
 */
export const errorHandler = (err, req, res, next) => {
    let error = err;

    // Si no es un AppError, convertirlo
    if (!(error instanceof AppError)) {
        // Manejar errores de Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            error = formatPrismaError(error);
        }
        // Manejar errores de validación genéricos
        else if (error.name === 'ValidationError') {
            error = new AppError(
                'Error de validación',
                400,
                'ValidationError',
                error.errors || [error.message]
            );
        }
        // Manejar errores JWT
        else if (error.name === 'JsonWebTokenError') {
            error = new AppError(
                'Token inválido',
                401,
                'UnauthorizedError'
            );
        }
        else if (error.name === 'TokenExpiredError') {
            error = new AppError(
                'Token expirado',
                401,
                'UnauthorizedError'
            );
        }
        // Convertir cualquier error a AppError
        else {
            error = new AppError(
                error.message || 'Error interno del servidor',
                error.statusCode || 500,
                error.name || 'InternalServerError',
                error.details || []
            );
        }
    }

    // Log del error en desarrollo
    if (process.env.NODE_ENV !== 'production') {
        console.error('\n❌ ERROR:');
        console.error(`  Status: ${error.statusCode}`);
        console.error(`  Type: ${error.error}`);
        console.error(`  Message: ${error.message}`);
        if (error.details?.length) {
            console.error(`  Details: ${JSON.stringify(error.details)}`);
        }
        console.error(`  Stack: ${err.stack}\n`);
    }

    // Respuesta JSON estandarizada
    const response = {
        success: false,
        error: error.error,
        message: error.message,
        details: error.details || [],
        ...(process.env.NODE_ENV !== 'production' && { timestamp: error.timestamp })
    };

    // No exponer stack trace en producción
    if (process.env.NODE_ENV === 'production' && error.statusCode === 500) {
        response.message = 'Error interno del servidor. Intenta más tarde.';
    }

    res.status(error.statusCode || 500).json(response);
};

/**
 * Wrapper para manejar errores en funciones async
 * Convierte excepciones en llamadas a next(error)
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};