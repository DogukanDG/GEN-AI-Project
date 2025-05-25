import express from "express";
const router = express.Router();

import 
{   loginUser,
    signupUser,
    logoutUser,
    updateProfilePicture,
    changePassword,
    deleteProfilePicture
} from "../controller/auth.js";
import pg from "pg";
import multer from "multer";
import path from "path";

const db = new pg.Client({
    host: "localhost",
    user: "postgres",
    database: "postgres",
    password: "5254322",
    port: "5432",
});
db.connect();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, req.session.userId + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get("/",(req,res) => {
    const alert = req.session.alert;
    delete req.session.alert;
    res.render("login.ejs",{alert});
})

router.post("/login",loginUser)

router.get("/signup",(req,res)=> {
    const alert = req.session.alert;
    delete req.session.alert;
    res.render("signup.ejs", {alert});
})

router.post("/signup",signupUser);

router.get("/HomePage", async (req, res) => {
    if (!req.session.userId) {
        req.session.alert = { type: 'danger', message: 'Please login first.' };
        return res.redirect("/user/");
    }
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1;", [req.session.userId]);
        if (result.rows.length === 0) {
            req.session.alert = { type: 'danger', message: 'User not found.' };
            return res.redirect("/user/");
        }
        const user = result.rows[0];
        const alert = req.session.alert;
        delete req.session.alert;
        res.render("HomePage.ejs", { user, alert });
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'danger', message: 'An error occurred.' };
        res.redirect("/user/");
    }
});

router.get("/logout", logoutUser);

router.get("/logout-success", (req, res) => {
    req.session.alert = { type: "success", message: "Logged out successfully." };
    res.redirect("/user/");
});

router.get("/bookings", async (req, res) => {
    if (!req.session.userId) {
        req.session.alert = { type: 'danger', message: 'Please login first.' };
        return res.redirect("/user/");
    }
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1;", [req.session.userId]);
        if (result.rows.length === 0) {
            req.session.alert = { type: 'danger', message: 'User not found.' };
            return res.redirect("/user/");
        }
        const user = result.rows[0];
        const alert = req.session.alert;
        delete req.session.alert;
        res.render("bookings.ejs", { user, alert });
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'danger', message: 'An error occurred.' };
        res.redirect("/user/");
    }
});

router.get("/profile", async (req, res) => {
    if (!req.session.userId) {
        req.session.alert = { type: 'danger', message: 'Please login first.' };
        return res.redirect("/user/");
    }
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1;", [req.session.userId]);
        if (result.rows.length === 0) {
            req.session.alert = { type: 'danger', message: 'User not found.' };
            return res.redirect("/user/");
        }
        const user = result.rows[0];
        const alert = req.session.alert;
        delete req.session.alert;
        res.render("profile.ejs", { user, alert });
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'danger', message: 'An error occurred.' };
        res.redirect("/user/");
    }
});

router.post("/profile/update", upload.single("profile_picture"), updateProfilePicture);
router.post("/profile/password", changePassword);
router.post("/profile/delete-picture", deleteProfilePicture);


export default router;