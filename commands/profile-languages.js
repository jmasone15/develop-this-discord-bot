const Profile = require("../models/profileModel");

module.exports = {
    name: "profile-languages",
    description: "Profile command to update the languages and technologies on your profile.",
    guildOnly: false,
    args: true,
    usage: "<languages>",
    aliases: ["profile-language", "profile-technologies", "profile-technology"],
    cooldown: 3,
    async execute(message, args) {
        try {

            // Using the author's id, we check to see if the author has a profile to update.
            const existingProfile = await Profile.findOne({ profileid: message.author.id });

            // If the user does not have an existing profile, the function ends.
            if (!existingProfile) {
                return message.reply("To use this command, you must first set up your profile with the command: \n\`$profile\`");
            };

            // If the only entrance in the language array is the default model value,
            // We need to get rid of it and create a brand new array.

            // If there are entrances in the array that aren't the default value,
            // We then need to add the new value to the existing array.

            if (existingProfile.languages[0] === "Use the command \`<$profile-languages> <language>\` to change your languages, please add one at a time.") {

                // Create the new array and push the argument value into it.
                const newLanguageArray = [];
                newLanguageArray.push(args[0]);

                // Update the author's profile languages with the new array minus the default value.
                await Profile.findByIdAndUpdate(existingProfile.id, { languages: newLanguageArray });
                message.reply("Your languages have been successfully updated!")
            } else {

                // Grab the existing array and push the new value into it.
                const languageArray = existingProfile.languages;
                languageArray.push(args[0]);

                // Update the author's profile languages with the new value.
                await Profile.findByIdAndUpdate(existingProfile.id, { languages: languageArray });
                message.reply("Your languages have been successfully updated!")
            }
        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        };
    },
};