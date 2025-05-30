const express = require("express");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();
const PORT = 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public")); 


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const { user, error } = await supabase.auth.signUp({ email, password });
//   console.log("User:", user);
  console.log("Error:", error);

  if (error) return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`);
  console.log("User signed up:", user);
});


app.post("/login", async (req, res) => {
    console.log("Login request received");
    console.log("Request body:", req.body);
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  console.log("Data:", data);
  console.log("Error:", error);

  if (error) return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`);

  res.cookie("access_token", data.session.access_token, { httpOnly: true });
  console.log("User logged in:", data.user);
//   res.redirect("/private");
});


app.get("/private", async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.redirect("/");

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.redirect("/");

   const filePath = path.join(__dirname, "private.html");

   fs.readFile(filePath, "utf8", (err, html) => {
      if (err) {
        console.error("Error: private.html could not be loaded!", err);
        return res.status(500).send("Server error: private.html not found.");
      }
    

    const modifiedHtml = html.replace("{{userEmail}}", data.user.email);
    res.send(modifiedHtml);
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

app.use((req,res,next) => {
  res.status(404).send("The page you are trying to reach is `Not Found`");
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));