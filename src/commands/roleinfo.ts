import {CacheType, CommandInteraction, MessageEmbed} from 'discord.js';

module.exports = {
    data: {
        name: 'role',
        description: '役職の情報を表示するよ！',
        options: [
            {
                type: 'ROLE',
                name: '役職',
                description: '役職の情報を表示するよ！',
                required: true
            }
        ],
    },
    async execute(interaction: CommandInteraction<CacheType>) {
        if (!interaction.isCommand()) {
            return;
        }
        const api_role = interaction.options.getRole('役職');
        if (api_role) {
            const role = interaction.guild?.roles.cache.get(api_role.id)
            if (role) {
                const embed = new MessageEmbed({
                    title: `Role - ${role.name}`,
                    description: '**ID**: `'+ role.id +'`',
                    color: role.color
                })
                embed.addField('作成日時', `> <t:${Math.floor(role.createdTimestamp / 1000)}:f>`, true)
                embed.addField('メンション可/不可', role.mentionable ? '> 可' : '> 不可' , true)
                embed.addField('外部サービスとの連携', role.mentionable ? '> 可' : '> 不可', true)
                embed.addField('役職の色', `> ${role.hexColor}`, true)
                embed.addField('権限', `> ${role.permissions.bitfield}`, true)
                if (role.iconURL()) {
                    embed.setThumbnail(<string> role.iconURL())
                }
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '指定された役職は見つからなかったよ！',
                    ephemeral: true
                });
            }
        }
    }
}
