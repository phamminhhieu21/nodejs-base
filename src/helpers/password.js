import bcrypt from "bcryptjs";

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}
export const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

export const generateTemporaryPassword = async (length) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const temporaryPassword = await bcrypt.hash('temporary', salt);
    return temporaryPassword.slice(0, length);
}