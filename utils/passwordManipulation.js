//ensuring double hashing of password so providing the database with a hashed password
const bcrypt = require("bcrypt")
const dotenv = require("dotenv/config.js")


const hashTheEnteredPasswordForSupa = async (password) => {
    try {
        let hashSalt = await bcrypt.genSalt(process.env.SALT_ROUNDS,);
        let hashedPassword = await bcrypt.hash( password,hashSalt);

        return hashedPassword;
    } catch (err) {
        throw new Error(err);
    }
}

const compareTheHashFromSupaWithEnteredPassword = async ( passwordFromSupa, userEnteredPassword ) => {
    try {
        let resultOfComparision = await bcrypt.compareSync(userEnteredPassword,passwordFromSupa);
        return resultOfComparision;
    }
    catch (err) {
        throw new Error(err);
    }
}




module.exports.hashTheEnteredPasswordForSupa = hashTheEnteredPasswordForSupa;
module.exports.compareTheHashFromSupaWithEnteredPassword = compareTheHashFromSupaWithEnteredPassword;