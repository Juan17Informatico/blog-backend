import { prisma } from "../db/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

class AuthService {
    async register(userData) {
        const { email, password, name } = userData;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        return this.generateToken(user);
    }

    async login(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error("Invalid credentials");
        }

        return this.generateToken(user);
    }

    async generateToken(user) {
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h",
        });

        const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);

        await prisma.token.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const dbToken = await prisma.token.findUnique({
                where: { token },
            });

            if (!dbToken) throw new Error("Token not found");
            if (new Date() > dbToken.expiresAt) throw new Error("Token expired");

            return decoded;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }

    async logout(token) {
        await prisma.token.deleteMany({
            where: { token },
        });
        return { message: "Logged out successfully" };
    }
}

export default new AuthService();
