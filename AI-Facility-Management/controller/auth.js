import pg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

const db=new pg.Client({
    host:"db-postgresql-fra1-58752-do-user-18319666-0.d.db.ondigitalocean.com",
    user:"doadmin",
    database:"defaultdb",
    password:"AVNS_ep-oncpEaSM5sC89eD4",
    port:"25060",
    ssl:{
        rejectUnauthorized:false
    }
})
db.connect();

const saltRounds=10;

export async function loginUser(req, res) {
    const loginData = {
        email: req.body.email,
        password: req.body.password,
    }
    try {
        const result = await db.query("SELECT * FROM users WHERE email=$1;", [loginData.email]);
        if (result.rows.length === 0) {
            req.session.alert = { type: 'danger', message: 'User not found. Please sign up.' };
            return res.redirect("/user/");
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(loginData.password, user.password);
        if (match) {
            req.session.userId = user.id;
            return res.redirect("/user/HomePage");
        } else {
            req.session.alert = { type: 'danger', message: 'Incorrect password.' };
            return res.redirect("/user/");
        }
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'danger', message: 'An error occurred.' };
        return res.redirect("/user/");
    }
}

export async function signupUser(req,res) {
    const signupData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    try {
        const checkUserRegistered = await db.query("SELECT FROM users WHERE email=$1;",[signupData.email]);
        if(checkUserRegistered.rows.length > 0) {
            req.session.alert = { type: 'warning', message: 'User already registered. Please login.' };
            return res.redirect("/user/");
        }else {
            bcrypt.hash(signupData.password, saltRounds, async function(err, hash) {
                if(err) {
                    console.error("ERROR HASHING PASSWORD : ",err);
                    req.session.alert = { type: 'danger', message: 'Error hashing password.' };
                    return res.redirect("/user/signup");
                }
                else {
                    await db.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;",[signupData.name, signupData.email, hash])
                    req.session.alert = { type: 'success', message: 'Signup successful! Please login.' };
                    return res.redirect("/user/");
                }
            }) 
        }
    } catch (error) {
        console.log(error)
        req.session.alert = { type: 'danger', message: 'An error occurred during signup.' };
        return res.redirect("/user/signup");
    }
}

export async function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            req.session = null;
            req.session.alert = { type: 'danger', message: 'Logout failed.' };
            return res.redirect("/user/");
        }
        // Create a new session for the alert
        res.redirect("/user/logout-success");
    });
}

export async function updateProfilePicture(req, res) {
    if (!req.session.userId) {
        req.session.alert = { type: 'danger', message: 'Please login first.' };
        return res.redirect("/user/");
    }
    if (!req.file) {
        req.session.alert = { type: 'warning', message: 'No file uploaded.' };
        return res.redirect("/user/profile");
    }
    const filePath = `/uploads/${req.file.filename}`;
    try {
        await db.query("UPDATE users SET profile_picture=$1 WHERE id=$2;", [filePath, req.session.userId]);
        req.session.alert = { type: 'success', message: 'Profile picture updated.' };
        res.redirect("/user/profile");
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'danger', message: 'Error updating profile picture.' };
        res.redirect("/user/profile");
    }
}

export async function deleteProfilePicture(req, res) {
    if (!req.session.userId) {
        req.session.alert = { type: 'danger', message: 'Please login first.' };
        return res.redirect("/user/");
    }
    try {
        const result = await db.query("SELECT profile_picture FROM users WHERE id=$1;", [req.session.userId]);
        if (result.rows.length === 0) {
            req.session.alert = { type: 'danger', message: 'User not found.' };
            return res.redirect("/user/profile");
        }
        const profilePicture = result.rows[0].profile_picture;
        if (profilePicture) {
            const filePath = path.join(process.cwd(), "public", profilePicture);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await db.query("UPDATE users SET profile_picture=NULL WHERE id=$1;", [req.session.userId]);
        req.session.alert = { type: 'success', message: 'Profile picture deleted.' };
        res.redirect("/user/profile");
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'danger', message: 'Error deleting profile picture.' };
        res.redirect("/user/profile");
    }
}

export async function changePassword(req, res) {
    if (!req.session.userId) {
        req.session.alert = { type: 'danger', message: 'Please login first.' };
        return res.redirect("/user/");
    }
    const { currentPassword, newPassword } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1;", [req.session.userId]);
        if (result.rows.length === 0) {
            req.session.alert = { type: 'danger', message: 'User not found.' };
            return res.redirect("/user/profile");
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            req.session.alert = { type: 'danger', message: 'Incorrect current password.' };
            return res.redirect("/user/profile");
        }
        const hash = await bcrypt.hash(newPassword, saltRounds);
        await db.query("UPDATE users SET password=$1 WHERE id=$2;", [hash, req.session.userId]);
        req.session.alert = { type: 'success', message: 'Password updated successfully.' };
        res.redirect("/user/profile");
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'danger', message: 'Error updating password.' };
        res.redirect("/user/profile");
    }
}

