module.exports = {
    name: "test",
    description: "Test command for developing.",
    cooldown: 5,
    guildOnly: true,
    aliases: ["tests", "cool-test"],
    args: true,
    usage: "<args>",
    permissions: "BAN_MEMBERS",
    async execute(message, args) {
        try {
            await message.channel.send("Hello world pt.2!" + " " + args[0]);
        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        }
    }
}