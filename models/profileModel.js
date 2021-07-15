// Require Mongoose
const mongoose = require("mongoose");

// Set up default entries for a user who has not setup their profile yet.
const color = "#7700ff"
const bio = "Use the command \`<$profile-bio> <bio>\` to change your bio.";
const github = "Use the command \`<$profile-github> <url>\` to change your github url.";
const portfolio = "Use the command \`<$profile-portfolio> <url>\` to change your portfolio url.";
const linkedin = "Use the command \`<$profile-linkedin> <url>\` to change your linkedIn url.";
const languages = ["Use the command \`<$profile-languages> <language>\` to change your languages, please add one at a time."];

// Build the profile schema.
// Multiple Users can have the same username across many servers, so database queries will be done by their unique id.
const profileSchema = new mongoose.Schema({
    profileid: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    thumbnail: { type: String, required: true },
    color: { type: String, required: true, default: color },
    bio: { type: String, required: true, default: bio },
    github: { type: String, required: true, unique: true, default: github },
    portfolio: { type: String, required: true, unique: true, default: portfolio },
    linkedin: { type: String, required: true, unique: true, default: linkedin },
    languages: { type: Array, required: true, default: languages }
});

// Build and export the schema
const Profile = mongoose.model("profile", profileSchema);
module.exports = Profile;