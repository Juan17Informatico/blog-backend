import AuthService from "../services/authService.js";

// Handle user registration
export const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await AuthService.register(userData);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Handle user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginResult = await AuthService.login({email, password});

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: loginResult,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

// Handle token generation if needed separately
export const getNewToken = async (req, res) => {
    try {
        const user = req.body;
        const newToken = await AuthService.generateToken(user);

        res.status(200).json({
            success: true,
            token: newToken,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
