const { hashTheEnteredPasswordForSupa } = require("../utils/passwordManipulation.js");


const signUpController = async (req,res,supabase) => {

    const { email, password } = req.body;
    //console.log(email, password);
    password = hashTheEnteredPasswordForSupa(password);
    const { user, error } = await supabase.auth.signUp({ email, password });
//   console.log("User:", user);
    console.log("Error:", error);

    if (error) return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`);
    console.log("User signed up:", user);
}


module.exports.signUpController = signUpController;