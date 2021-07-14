module.exports = {
    name: "test",
    description: "Test command for developing.",
    cooldown: 5,
    guildOnly: true,
    aliases: ["tests", "cool-test"],
    args: false,
    usage: " ",
    async execute(message, args) {
        try {
            await message.channel.send("Hello world pt.2!")
        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        }
    }
}