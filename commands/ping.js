const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    // Setup the command and the cooldown using a discord js builder
    data: {
        command: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
        cooldown: 3
    },
    async execute(interaction) {
        try {
            await interaction.reply({ content: "Pong!", ephemeral: true });
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: "Something went wrong with this command!", ephemeral: true })
        }
    }
}