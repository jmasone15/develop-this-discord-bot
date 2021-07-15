module.exports = {
    name: "",
    description: "",
    guildOnly: true,
    args: false,
    usage: " ",
    aliases: ["", ""],
    cooldown: 3,
    async execute(message, args) {
        try {

        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        }
    }
}