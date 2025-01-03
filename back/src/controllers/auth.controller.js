import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    };

    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres." });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email já cadastrado" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName, email,
            password: hashedPassword,
        });

        if (newUser) {
            // generate jwt
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        };
        return res.status(400).json({ message: "Erro ao cadastrar usuário!" })
    } catch (error) {
        console.log("Erro ao cadastrar usuário: ", error);
        return res.status(500).json({ message: "Erro ao cadastrar usuário!" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuário não encontrado!" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Senha inválida!" });

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            joinedCommunities: user.joinedCommunities,
        });
    } catch (error) {
        console.log("Erro ao fazer login: ", error);
        return res.status(500).json({ message: "Erro ao fazer login" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Usuário deslogado com sucesso!" });
    } catch (error) {
        console.log("Erro ao fazer logout: ", error);
        return res.status(500).json({ message: "Erro ao fazer logout!" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) return res.status(400).json({ message: "Foto de perfil é obrigatória!" });

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        return res.status(200).json({ updatedUser });
    } catch (error) {
        console.log("Erro ao atualizar perfil: ", error);
        return res.status(500).json({ message: "Erro ao atualizar perfil!" })
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json( req.user );
    } catch (error) {
        console.log("Erro ao verificar autenticação: ", error);
        return res.status(500).json({ message: "Erro ao verificar autenticação!" })
    };
};