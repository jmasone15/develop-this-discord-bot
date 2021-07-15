const Profile = require("../models/profileModel");

module.exports = {
    name: "profile-color",
    description: "Profile command to update the color of your profile message.",
    guildOnly: false,
    args: false,
    usage: "<#000000>",
    aliases: ["profiles-color", "profile-colors"],
    cooldown: 3,
    async execute(message, args) {
        const author = message.author;

        try {

            // Using the author's id, we check to see if the author has a profile to update.
            const existingProfile = await Profile.findOne({ profileid: author.id });

            // If the user does not have an existing profile, the function ends.
            if (!existingProfile) {
                return message.reply("To use this command, you must first set up your profile with the command: \n\`$profile\`");
            };

            // Validation to check that the entered color is in hex code, six-digit format.
            if (!args[0].startsWith("#")) {
                return message.reply("Make sure to enter a color in hex code format (#000000).");
            };
            if (args[0].length < 7) {
                return message.reply("Make sure to enter a color in hex code format (#000000).");
            };

            // Update the author's profile.
            await Profile.findByIdAndUpdate(existingProfile.id, { color: args[0] });
            message.reply("Your color has been successfully updated!");

        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        }
    }
}