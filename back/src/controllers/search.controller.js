import User from "../models/user.model.js";

export const searchUsersOrCommunities = async (req, res) => {
    try {
        const { searchKeys: query } = req.params;

        console.log(query);

        const users = await User.find({ fullName: { $regex: query, $options: "i" } }).select("-password");

        // todo: buscar comunidades

        return res.status(200).json({ users });
    } catch (error) {
        console.log("Erro ao buscar usuários ou comunidades: ", error);
        return res.status(500).json({ message: "Erro ao buscar usuários ou comunidades" });
    }
};