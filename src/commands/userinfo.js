const { MessageEmbed } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: {
        name: 'user',
        description: '役職の情報を表示するよ！',
        options: [
            {
                type: 'USER',
                name: 'ユーザー',
                description: 'ユーザーの情報を表示するよ！',
                required: true
            }
        ],
    },
    async execute(interaction) {
        if (!interaction.isCommand()) {
            return;
        }
        const user = interaction.options.getUser('ユーザー');
        if (user) {
            const member = interaction.guild?.members.cache.get(user.id)

            const bufferData = fs.readFileSync('./src/data/badge_data.json', 'utf8')
            const dataJSON = bufferData.toString()
            const data = JSON.parse(dataJSON)

            const badge_list = []

            if (user.flags){
                for (let flag of user.flags?.toArray()){
                    badge_list.push(data[flag])
                }
            }

            if (member) {
                const presence_list = {
                    'online': '<:Status_Online:906860685764460555> オンライン',
                    'idle': '<:Status_Idle:906860686125182996> 退席中',
                    'dnd': '<:Status_Dnd:906860686343299123> 取り込み中',
                    'invisible': '<:Status_Offline:906860686066470922> オフライン',
                    'offline': '<:Status_Offline:906860686066470922> オフライン'
                }


                const embed = new MessageEmbed({
                    title: `User - ${member.user.tag}`,
                    description: '**ID**: `'+ member.id +'`',
                    color: member.displayHexColor
                })
                embed.addField('ニックネーム', `> ${member.user.username}`, true)
                embed.addField('ステータス', member.presence ? `> ${presence_list[member.presence.status]}` : '> 不可', true)
                embed.addField('Bot/User', member.user.bot ? '> Bot' : '> User', true)
                embed.addField('バッチ', badge_list ?`> ${badge_list.join(', ')}` : '> なし')
                embed.addField('アカウント作成日時', `> <t:${Math.floor(member.user.createdTimestamp / 1000)}:f>`)
                embed.addField('サーバー参加日時', member.joinedTimestamp ? `> <t:${Math.floor(member.joinedTimestamp / 1000)}:f>` : '> 取得不可')

                embed.addField(`役職 - ${member.roles.cache.size}`, `> ${member.roles.cache.map(r => r.name).join(', ')}`, true)
                if (member.avatarURL()) {
                    embed.setThumbnail(member.avatarURL({format: 'png'}))
                }

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            } else {
                const embed = new MessageEmbed({
                    title: `User - ${user.tag}`,
                    description: '**ID**: `'+ user.id +'`',
                    color: user.hexAccentColor ? user.hexAccentColor : '#ffffff'
                })
                embed.addField('ニックネーム', `${user.username}`)
                embed.addField('アカウント作成日時', `> <t:${Math.floor(user.createdTimestamp / 1000)}:f>`)
                embed.addField('バッチ', user.flags ?`> ${badge_list.join(', ')}` : '> なし')

                if (user.avatarURL()) {
                    embed.setThumbnail(user.avatarURL({format: 'png'}))
                }
                if (user.bannerURL()){
                    embed.setImage(user.bannerURL({format: 'png'}))
                }

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        }
    }
}
