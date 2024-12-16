import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    };
   
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres" });
        }

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email já cadastrado" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // generate jwt
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ message: "Erro ao cadastrar usuário" })
        }
    } catch (error) {
        console.log("Erro ao cadastrar usuário: ", error);
        res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado!" });
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Senha inválida!"});
        };

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Erro ao fazer login: ", error);
        res.status(500).json({ message: "Erro ao fazer login" });
    }
};

export const logout = (req, res) => {
    res.send("logout route");
};