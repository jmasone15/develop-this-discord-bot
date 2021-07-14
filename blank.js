module.exports = {
    name: "",
    description: "",
    cooldown: 5,
    args: false,
    usage: " ",
    async execute(message, args) {
        try {

        } catch (err) {
            console.error(err);
            message.reply("Error using this command, please try again.")
        }
    }
}