// Import the Profile model
const Profile = require("../models/profileModel");

module.exports = {
    name: "profile",
    description: "Setup a developer profile for your personal account or view another person's account.",
    guildOnly: true,
    args: false,
    usage: "<@username>(optional)",
    aliases: ["profiles", "profile-setup", "developer", "developers"],
    cooldown: 3,
    async execute(message, args, Discord) {
        const author = message.author;
        console.log(author.id)

        // The arguments function will return an empty array if there are no arguments.
        // So to see if the author wants to view/setup profile or view another user's profile, we check the length of the args array.
        // If the array has no length, because it has no values, we fetch or setup the author's profile.
        if (!args.length) {
            try {
                // Using the author's id, we check to see if the author has previously setup their profile.
                const existingProfile = await Profile.findOne({ profileid: author.id });

                // If the author has an existing profile, we return their profile in an embed message, populated with their individual data.
                if (existingProfile) {
                    const existingProfileMessageEmbed = new Discord.MessageEmbed()
                        .setColor(existingProfile.color)
                        .setTitle(existingProfile.username)
                        .setDescription(existingProfile.bio)
                        .setThumbnail(existingProfile.thumbnail)
                        .addFields(
                            { name: '\u200B', value: '\u200B' },
                            { name: "Github", value: existingProfile.github, inline: true },
                            { name: "Portfolio", value: existingProfile.portfolio, inline: true },
                            { name: "LinkedIn", value: existingProfile.linkedin, inline: true },
                            { name: "Languages/Technologies", value: existingProfile.languages.join(", ") }
                        )
                        .setTimestamp();

                    // Send the message embed to the user.
                    try {
                        await message.reply(existingProfileMessageEmbed);
                    } catch (err) {
                        console.error(err);
                        message.reply("There was a message embed error, please contact bot admin for assitance.");
                    }

                } else {

                    // If the author does not have an existing profile, we can setup their profile by creating a new value in the database.
                    // We only enter the user's id, username, and thumbnail into the database.
                    // The rest of the data is covered by the default values we set up in the model.

                    // Create the new profile class.
                    const newProfile = new Profile({
                        profileid: author.id,
                        username: author.username,
                        thumbnail: author.displayAvatarURL({ format: "png", dynamic: true })
                    });

                    // Save the newly created profile to the database
                    const savedProfile = await newProfile.save();

                    // We then want the user to populate their new profile with data about themselves.
                    // We send them an embed with their new profile, which only has their username and avatar.
                    // The default values from the model inform the user what commands they can use to continue their profile setup.
                    // We also send the user a dm about how to finish their profile.
                    const profileMessageEmbed = new Discord.MessageEmbed()
                        .setColor(savedProfile.color)
                        .setTitle(savedProfile.username)
                        .setDescription(savedProfile.bio)
                        .setThumbnail(savedProfile.thumbnail)
                        .addFields(
                            { name: '\u200B', value: '\u200B' },
                            { name: "Github", value: savedProfile.github, inline: true },
                            { name: "Portfolio", value: savedProfile.portfolio, inline: true },
                            { name: "LinkedIn", value: savedProfile.linkedin, inline: true },
                            { name: "Languages/Technologies", value: savedProfile.languages.join(", ") }
                        )
                        .setTimestamp()

                    // Send the message embed to the user.
                    try {
                        await message.reply(profileMessageEmbed);
                        message.reply("Your profile has been setup! \nI just sent you a dm with a list of all the profile commands.")
                    } catch (err) {
                        console.error(err);
                        message.reply("There was a message embed error, please contact bot admin for assitance.");
                    }
                }
            } catch (err) {
                console.error(err);
                message.reply("There was an error with the profile command, please contact bot admin for assitance.");
            };

        } else {
            // If the arguments array does have length, the author wants to find the profile of the tagged user.

            // We grab the tagged user from the message.mentions object
            // We then have to check to see if the member is in the guild the message was sent in.
            // The taggedMember also returns the tagged user's id, so that we can enter it into the database.
            const taggedUser = message.mentions.users.first();
            const taggedMember = message.guild.member(taggedUser);

            // If the tagged user is not a member of the guild the message was sent in, the function ends.
            if (!taggedMember) {
                return message.reply("That user is not a member of this server.")
            };

            // After confirming the user is in the target guild and obtaining their user id, we can query the database for that user.
            try {
                const findProfile = await Profile.findOne({ profileid: taggedMember.id });

                if (!findProfile) {
                    return message.reply("This user has not set up their profile yet!");
                }

                const findProfileMessageEmbed = new Discord.MessageEmbed()
                    .setColor(findProfile.color)
                    .setTitle(findProfile.username)
                    .setDescription(findProfile.bio)
                    .setThumbnail(findProfile.thumbnail)
                    .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: "Github", value: findProfile.github, inline: true },
                        { name: "Portfolio", value: findProfile.portfolio, inline: true },
                        { name: "LinkedIn", value: findProfile.linkedIn, inline: true },
                        { name: "Languages", value: findProfile.languages.join(", ") }
                    )
                    .setTimestamp()

                try {
                    await message.reply(findProfileMessageEmbed);
                } catch (err) {
                    console.error(err);
                    message.reply("There was a message embed error, please contact bot admin for assitance.")
                };

            } catch (err) {
                console.error(err);
                message.reply("There was an error with the profile command, please contact bot admin for assitance.");
            };
        };
    },
};