const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'server',
        description: 'このサーバーの情報を表示するよ！'
    },
    async execute(interaction) {
        if (!interaction.isCommand()) {
            return;
        }
        const guild = interaction.guild
        if (guild){
            const mfa_level = { 'NONE': 'オフ', 'ELEVATED': 'オン' }
            const premium_tier = { 'NONE': 'なし', 'TIER_1': 'Level 1', 'TIER_2': 'Level 2', 'TIER_3': 'Level 3' }
            const premium_emoji = { 'NONE': '50', 'TIER_1': '100', 'TIER_2': '150', 'TIER_3': '250' }
            const premium_sticker = { 'NONE': '0', 'TIER_1': '15', 'TIER_2': '30', 'TIER_3': '60' }

            const embed = new MessageEmbed({
                title: guild.name,
                description: '**ID**: `'+ guild.id +'`'
            })
            const owner = await guild.fetchOwner()
            const guild_created = Math.floor(guild.createdTimestamp / 1000)
            const guild_icon = guild.iconURL({format: 'png'})
            const guild_mfa = mfa_level[guild.mfaLevel]
            const guild_premium = premium_tier[guild.premiumTier]
            const guild_premium_count = guild.premiumSubscriptionCount ? guild.premiumSubscriptionCount : '0'
            const guild_ch = guild.channels.cache
            const guild_member = await guild.members.fetch()
            const guild_emoji = guild.emojis.cache
            const guild_sticker = guild.stickers.cache
            const guild_role = guild.roles.cache
            const guild_system = guild.systemChannel ? guild.systemChannel.name : 'なし'

            const voice = guild_ch.filter(ch => ch.type === 'GUILD_VOICE').size
            const stage =  guild_ch.filter(ch => ch.type === 'GUILD_STAGE_VOICE').size
            const news_ch = guild_ch.filter(ch => ch.type === 'GUILD_NEWS').size
            const store_ch = guild_ch.filter(ch => ch.type === 'GUILD_STORE').size

            const category_ch = String(guild_ch.filter(ch => ch.type === 'GUILD_CATEGORY').size)
            const text_ch = String(guild_ch.filter(ch => ch.type === 'GUILD_TEXT').size)
            const voice_ch = String(voice + stage)
            const thread_ch = String(guild_ch.filter(ch => ch.isThread()).size)
            const other_ch = String(news_ch + store_ch)

            const member_count = String(guild_member.filter(m => !m.user.bot).size)
            const bot_count = String(guild_member.filter(m => m.user.bot).size)
            const ban_count = String(( await guild.bans.fetch({cache: true})).size)

            const emoji_count = String(guild_emoji.filter(e => !e.animated).size)
            const animated_count = String(guild_emoji.filter(e => e.animated === true).size)
            const max_emoji = premium_emoji[guild.premiumTier]
            const sticker_count = String(guild_sticker.size)
            const max_sticker = premium_sticker[guild.premiumTier]

            const channel_text = '```diff\n'+
                `+ カテゴリーチャンネル: ${category_ch}\n+ テキストチャンネル: ${text_ch}\n+ ボイスチャンネル: ${voice_ch}\n+ スレッドチャンネル: ${thread_ch}\n+ その他: ${other_ch}\n`
                +`+ システムチャンネル: ${guild_system}\n`
                +'```'

            const member_text = '```diff\n'+
                `+ メンバー: ${member_count}\n+ BOT: ${bot_count}\n- BANされた人数: ${ban_count}\n`
                +'```'

            const emoji_text = '```diff\n'+
                `+ 絵文字: ${emoji_count}/${max_emoji}\n+ アニメーション: ${animated_count}/${max_emoji}\n+ スタンプ: ${sticker_count}/${max_sticker}\n`
                +'```'

            embed.addField('オーナー', `> ${owner.user.tag} (${owner.id})`)
            embed.addField('作成日時', `> <t:${guild_created}:f>`, true)
            embed.addField('アイコン', guild_icon ? `> [URL](${guild_icon})` : '> なし' , true)
            embed.addField('管理の二要素認証', `> ${guild_mfa}`, true)
            embed.addField(`Nitro Boosts - ${guild_premium}`, `> ${guild_premium_count}`, true)
            embed.addField(`チャンネル - ${guild_ch.size}/500`, channel_text)
            embed.addField(`メンバー - ${guild_member.size}`, member_text)
            embed.addField(`絵文字 - ${guild_emoji.size}`, emoji_text)
            embed.addField(`役職 - ${guild_role.size}`, `> ${guild_role.map(r => r.name).join(', ')}`)
            if (guild.discoverySplash) {
                embed.setImage(guild.discoverySplash)
            }
            if (guild_icon) {
                embed.setThumbnail(guild_icon)
            }
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}
