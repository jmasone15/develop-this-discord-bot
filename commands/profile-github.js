const Profile = require("../models/profileModel");

module.exports = {
    name: "profile-github",
    description: "Profile command to update the github of your profile message.",
    guildOnly: false,
    args: true,
    usage: "<url>",
    aliases: ["profiles-github", "profile-githubs"],
    cooldown: 3,
    async execute(message, args) {
        try {

            // Using the author's id, we check to see if the author has a profile to update.
            const existingProfile = await Profile.findOne({ profileid: message.author.id });

            // If the user does not have an existing profile, the function ends.
            if (!existingProfile) {
                return message.reply("To use this command, you must first set up your profile with the command: \n\`$profile\`");
            };

            // Validation to make sure the entered argument is a github link.
            if (!args[0].startsWith("https://github.com/")) {
                return message.reply("Make sure to enter a valid github link (https://github.com/username)");
            };

            // Update the author's profile github.
            await Profile.findByIdAndUpdate(existingProfile.id, { github: args[0] });
            message.reply("Your github has been updated successfully!");

        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        }
    }
}