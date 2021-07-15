const Profile = require("../models/profileModel");

module.exports = {
    name: "profile-bio",
    description: "Profile command to update the bio of your profile message.",
    guildOnly: false,
    args: true,
    usage: "<bio>",
    aliases: ["profiles-bio", "profile-bios"],
    cooldown: 3,
    async execute(message, args) {
        try {

            // Using the author's id, we check to see if the author has a profile to update.
            const existingProfile = await Profile.findOne({ profileid: message.author.id });

            // If the user does not have an existing profile, the function ends.
            if (!existingProfile) {
                return message.reply("To use this command, you must first set up your profile with the command: \n\`$profile\`");
            };

            // Update the author's profile bio.
            // Because all of the arguments return in an array, we use the join method to concat the array of strings together.
            await Profile.findByIdAndUpdate(existingProfile.id, { bio: args.join(" ") });
            message.reply("Your bio has been updated successfully!");

        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        }
    }
}