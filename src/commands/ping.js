module.exports = {
    data: {
        name: 'ping',
        description: 'Botの応答速度を測定するよ！'
    },
    async execute(interaction) {
        await interaction.reply({ content: 'Pinging...', ephemeral: true});
        const timeDiff = (new Date()).getTime() - interaction.createdAt.getTime();
        await interaction.editReply({ content: `Pong! 🏓Took: ${Math.floor(timeDiff)} ms` });
    }
}