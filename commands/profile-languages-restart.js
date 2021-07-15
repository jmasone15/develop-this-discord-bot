const Profile = require("../models/profileModel");

module.exports = {
    name: "profile-languages-restart",
    description: "Profile command to restart the languages and technologies on your profile.",
    guildOnly: false,
    args: false,
    usage: " ",
    aliases: ["profile-language-restart", "profile-technologies-restart", "profile-technology-restart"],
    cooldown: 3,
    async execute(message, args) {
        try {

            // Using the author's id, we check to see if the author has a profile to update.
            const existingProfile = await Profile.findOne({ profileid: message.author.id });

            // If the user does not have an existing profile, the function ends.
            if (!existingProfile) {
                return message.reply("To use this command, you must first set up your profile with the command: \n\`$profile\`");
            };

            // Reset the author's languages to the default value set by the model.
            const resetLanguages = ["Use the command \`<$profile-languages> <language>\` to change your languages, please add one at a time."];

            // Update the author's profile languages to be empty.
            await Profile.findByIdAndUpdate(existingProfile.id, { languages: resetLanguages });
            message.reply("Your languages have been successfully reset!");

        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        };
    },
};