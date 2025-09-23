import { prisma } from "../db/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    generateToken(user) {
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}

export default new AuthService();
