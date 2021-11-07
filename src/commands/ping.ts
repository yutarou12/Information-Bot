import {CacheType, CommandInteraction} from 'discord.js';

module.exports = {
    data: {
        name: 'ping',
        description: 'Botの応答速度を測定するよ！',
    },
    async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.reply({ content: 'Pinging...', ephemeral: true});
        const timeDiff = Date.now() - interaction.createdAt.getTime();
        await interaction.editReply({ content: `Pong! 🏓Took: ${Math.floor(timeDiff)} ms` });
    }
}