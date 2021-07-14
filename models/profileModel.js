const mongoose = require("mongoose");
const bio = "Use the command \'<!profile.bio> <bio>'\ to change your bio.";
const github = "Use the command '<!profile.github> <url>' to change your github url.";
const portfolio = "Use the command '<!profile.portfolio> <url>' to change your portfolio url.";
const linkedin = "Use the command '<!profile.linkedIn> <url>' to change your linkedIn url.";
const languages = ["Use the command '<!profile.languages> <language>' to change your languages, please add one at a time."];

const profileSchema = new mongoose.Schema({
    authorid: { type: String, required: true, unique: true },
    thumbnail: { type: String, required: true },
    bio: { type: String, required: true, default: bio },
    github: { type: String, required: true, default: github },
    portfolio: { type: String, required: true, default: portfolio },
    linkedin: { type: String, required: true, default: linkedin },
    languages: { type: Array, required: true, default: languages }
});

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;