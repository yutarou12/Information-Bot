const {
    CategoryChannel,
    MessageEmbed, NewsChannel, StageChannel,
    StoreChannel,
    TextChannel, ThreadChannel,
    VoiceChannel
} = require('discord.js');

const fs = require("fs");

module.exports = {
    data: {
        name: 'channel',
        description: 'チャンネルの情報を表示するよ！',
        options: [
            {
                type: 'CHANNEL',
                name: 'チャンネル',
                description: 'チャンネルの情報を表示するよ！',
                required: true
            }
        ],
    },
    async execute(interaction) {
        function sort_permissions(permissions){
            const perm_list = []
            try {
                const bufferData = fs.readFileSync('./src/data/permissions_list.json', 'utf8')
                const dataJSON = bufferData.toString()
                const data = JSON.parse(dataJSON)
                for(let perm of permissions){
                    perm_list.push('`'+data[perm]+'`')
                }
            } catch (e) {
                console.log(e)
            }
            const result = perm_list.filter(function( item ) {
                return item !== '`undefined`';
            });
            return result.join(', ')
        }

        if (!interaction.isCommand()) {
            return;
        }
        const api_ch = interaction.options.getChannel('チャンネル');

        if (api_ch) {
            const channel = interaction.guild?.channels.cache.get(api_ch.id)
            const member = interaction.guild?.members.cache.get(interaction.member.user.id)
            if (channel && member) {
                const embeds = []
                const ch_type = {
                    'GUILD_TEXT': '<:Channel_Text:906858885946703892> テキスト',
                    'GUILD_VOICE': '<:Channel_Voice:906858885472747531> ボイス',
                    'GUILD_CATEGORY': '<:Channel_Category:906858885921513522> カテゴリー',
                    'GUILD_NEWS': '<:Channel_Announce:906858885594374185> アナウンス',
                    'GUILD_STORE': '<:Channel_Store:906860211602604103> ストア',
                    'GUILD_STAGE_VOICE': '<:Channel_Stage:906858885908926495> ステージ',
                    'GUILD_NEWS_THREAD': '<:Channel_Thread:906858885976047646> ニューススレッド',
                    'GUILD_PUBLIC_THREAD': '<:Channel_Thread:906858885976047646> 公開スレッド',
                    'GUILD_PRIVATE_THREAD': '<:Channel_Thread:906858885976047646> 非公開スレッド'
                }
                const archive_time = {
                    60 : '1時間',
                    1440: '24時間',
                    4320: '<:Nitro_Boost:906860014365446164> 3日間',
                    10080: '<:Nitro_Boost:906860014365446164> 1週間',
                    'MAX': 'MAX'
                }
                const embed = new MessageEmbed({
                    title: `Channel - ${channel.name}`,
                    description: '**ID**: `'+ channel.id +'`'
                })
                embed.addField('種類', `> ${ch_type[channel.type]}チャンネル`, true)
                embed.addField('チャンネル作成日時', `> <t:${Math.floor(channel.createdTimestamp / 1000)}:f>`, true)
                switch (channel.type) {
                    case 'GUILD_TEXT':
                        if (channel instanceof TextChannel) {
                            embed.addField('トピック', channel.topic ? `> ${channel.topic}`: `> なし`)
                            embed.addField('親カテゴリ', channel.parent ? `> ${channel.parent.name}` : '> なし', true)
                            embed.addField('NSFW', channel.nsfw ? '> オン' : '> オフ', true)
                            embed.addField('低速モード', channel.rateLimitPerUser ? `> ${channel.rateLimitPerUser}s`: '> オフ', true)
                            embed.addField('スレッドのアーカイブまでの時間', channel.defaultAutoArchiveDuration ? `> ${archive_time[channel.defaultAutoArchiveDuration]}`: '> なし')
                            embed.addField(`権限 - ${channel.permissionsFor(member).bitfield}`, `> ${sort_permissions(channel.permissionsFor(member).toArray())}`)
                        }

                        embeds.push(embed)
                        break
                    case 'GUILD_VOICE':
                        if (channel instanceof VoiceChannel) {
                            embed.addField('親カテゴリ', channel.parent ? `> ${channel.parent.name}` : '> なし')
                            embed.addField('ビットレート', `> ${channel.bitrate / 1000} kbps`, true)
                            embed.addField('参加可能人数', channel.userLimit ? `> ${channel.userLimit} 人` : '> ∞', true)
                            embed.addField('地域', channel.rtcRegion ? `> ${channel.rtcRegion}` : '> 自動', true)
                            embed.addField(`権限 - ${channel.permissionsFor(member).bitfield}`, `> ${sort_permissions(channel.permissionsFor(member).toArray())}`)
                        }

                        embeds.push(embed)
                        break
                    case 'GUILD_CATEGORY':
                        if (channel instanceof CategoryChannel) {
                            embed.addField('カテゴリー内のチャンネル数', `> ${channel?.children.size}`)
                            embed.addField(`権限 - ${channel.permissionsFor(member).bitfield}`, `> ${sort_permissions(channel.permissionsFor(member).toArray())}`)
                        }
                        embeds.push(embed)
                        break
                    case 'GUILD_NEWS':
                        if (channel instanceof NewsChannel) {
                            embed.addField(`権限 - ${channel.permissionsFor(member).bitfield}`, `> ${sort_permissions(channel.permissionsFor(member).toArray())}`)
                        }

                        embeds.push(embed)
                        break
                    case 'GUILD_STORE':
                        if (channel instanceof StoreChannel) {
                            embed.addField('親カテゴリ', channel.parent ? `> ${channel.parent.name}` : '> なし')
                            embed.addField('NSFW', channel.nsfw ? '> オン' : '> オフ')
                            embed.addField(`権限 - ${channel.permissionsFor(member).bitfield}`, `> ${sort_permissions(channel.permissionsFor(member).toArray())}`)
                        }

                        embeds.push(embed)
                        break
                    case 'GUILD_STAGE_VOICE':
                        if (channel instanceof StageChannel){
                            embed.addField('親カテゴリ', channel.parent ? `> ${channel.parent.name}` : '> なし')
                            embed.addField('ビットレート', `> ${channel.bitrate / 1000} kbps`, true)
                            embed.addField('参加可能人数', channel.userLimit ? `> ${channel.userLimit} 人` : '> ∞', true)
                            embed.addField('地域', channel.rtcRegion ? `${channel.rtcRegion}` : '> 自動', true)
                            embed.addField('現在の人数', channel.members.size ? `> ${channel.members.size} 人` : '> いないよ')
                            embed.addField(`権限 - ${channel.permissionsFor(member).bitfield}`, `> ${sort_permissions(channel.permissionsFor(member).toArray())}`)
                        }

                        embeds.push(embed)
                        break
                    case 'GUILD_PUBLIC_THREAD':
                        if (channel instanceof ThreadChannel){
                            const starter_msg = await channel.fetchStarterMessage({force: true})

                            embed.addField('親チャンネル', channel.parent ? `> ${channel.parent.name}` : '> なし')
                            embed.addField('参加メンバー数', `> ${channel.guildMembers.size}`, true)
                            embed.addField('低速モード', channel.rateLimitPerUser ? `> ${channel.rateLimitPerUser}s`: '> オフ', true)
                            embed.addField('アーカイブ', channel.archived ? '> されている' : '> されていない', true)
                            if (channel.archived) {
                                embed.addField('アーカイブ日時', channel.archiveTimestamp ? `> <t:${Math.floor(channel.archiveTimestamp / 1000)}:f>` : '> -')
                            }
                            embed.addField('アーカイブまでの時間', channel.autoArchiveDuration ? `> ${archive_time[channel.autoArchiveDuration]}`: '> なし')
                            if (starter_msg.embeds.length > 0) {
                                embed.addField('最初のメッセージ', `> [埋め込みメッセージ](${starter_msg.url})`)
                            } else {
                                embed.addField('最初のメッセージ', '```\n' + starter_msg.cleanContent + '\n```')
                            }
                        }

                        embeds.push(embed)
                        break
                    case 'GUILD_PRIVATE_THREAD':
                        if (channel instanceof ThreadChannel){
                            const starter_msg = await channel.fetchStarterMessage({force: true})

                            embed.addField('親チャンネル', channel.parent ? `> ${channel.parent.name}` : '> なし')
                            embed.addField('参加メンバー数', `> ${channel.guildMembers.size}`, true)
                            embed.addField('低速モード', channel.rateLimitPerUser ? `> ${channel.rateLimitPerUser}s`: '> オフ', true)
                            embed.addField('アーカイブ', channel.archived ? '> されている' : '> されていない', true)
                            if (channel.archived) {
                                embed.addField('アーカイブ日時', channel.archiveTimestamp ? `> <t:${Math.floor(channel.archiveTimestamp / 1000)}:f>` : '> -')
                            }
                            embed.addField('アーカイブまでの時間', channel.autoArchiveDuration ? `> ${archive_time[channel.autoArchiveDuration]}`: '> なし')
                            if (starter_msg.embeds.length > 0) {
                                embed.addField('最初のメッセージ', `> [埋め込みメッセージ](${starter_msg.url})`)
                            } else {
                                embed.addField('最初のメッセージ', '```\n' + starter_msg.cleanContent + '\n```')
                            }
                        }

                        embeds.push(embed)
                        break
                    case 'GUILD_NEWS_THREAD':
                        if (channel instanceof ThreadChannel){
                            const starter_msg = await channel.fetchStarterMessage({force: true})

                            embed.addField('親チャンネル', channel.parent ? `> ${channel.parent.name}` : '> なし')
                            embed.addField('参加メンバー数', `> ${channel.guildMembers.size}`, true)
                            embed.addField('低速モード', channel.rateLimitPerUser ? `> ${channel.rateLimitPerUser}s`: '> オフ', true)
                            embed.addField('アーカイブ', channel.archived ? '> されている' : '> されていない', true)
                            if (channel.archived) {
                                embed.addField('アーカイブ日時', channel.archiveTimestamp ? `> <t:${Math.floor(channel.archiveTimestamp / 1000)}:f>` : '> -')
                            }
                            embed.addField('アーカイブまでの時間', channel.autoArchiveDuration ? `> ${archive_time[channel.autoArchiveDuration]}`: '> なし')
                            if (starter_msg.embeds.length > 0) {
                                embed.addField('最初のメッセージ', `> [埋め込みメッセージ](${starter_msg.url})`)
                            } else {
                                embed.addField('最初のメッセージ', '```\n' + starter_msg.cleanContent + '\n```')
                            }
                        }

                        embeds.push(embed)
                        break
                }

                await interaction.reply({
                    embeds: embeds,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '指定されたチャンネルは見つからなかったよ！',
                    ephemeral: true
                });
            }
        }
    }
}
