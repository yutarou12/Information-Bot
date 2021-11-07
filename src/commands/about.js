const discord = require('discord.js')

module.exports = {
    data: {
        name: 'about',
        description: 'Botの情報を表示するよ！',
    },
    async execute(interaction) {
        const client = interaction.client
        const embed = new discord.MessageEmbed({
            title: interaction.client.user.tag,
            description: '```\nスラッシュコマンドを使ったチャンネルなどの情報検索BOTだよ。\n```'
        })
        embed.addField('開発者', '```c\n# yutarou1241477#7286\n```')
        embed.addField('開発言語', '```yml\nTypescript: 4.4.4\nDiscord.js:'+ discord.version + '```')
        embed.addField('詳細', '```yml\n'+`導入サーバー数: ${client.guilds.cache.size}\nユーザー数: ${client.users.cache.size}`+'\n```')
        embed.addField('各種リンク', `[BOTの招待リンク](${process.env.BOT_OAUTH}) | [公式サーバー](https://discord.gg/k5Feum44gE) | [開発者のサイト](https://syutarou.xyz)`)
        embed.setThumbnail(client.user.avatarURL())
        await interaction.reply({embeds: [embed]});
    }
}