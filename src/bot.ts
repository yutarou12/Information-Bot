import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import * as fs from "fs";
import { join } from 'path';

dotenv.config();

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_PRESENCES]
const client = new Client({ intents: intents});

const commands: any  = {}
const commandFiles = fs.readdirSync(join(__dirname, '.', 'commands/')).filter(file => file.endsWith('.ts'))

for (const file of commandFiles) {
    const command = require(join(__dirname, '.', 'commands/')+file);
    commands[command.data.name] = command
}

client.once("ready", async () => {
    const data = []
    for (const commandName in commands) {
        data.push(commands[commandName].data)
    }
    if (client.isReady()){
        await client.application?.commands.set(data);
        await client.user?.setActivity({name: `Prefix: / | ${client.guilds.cache.size}guilds`})
    }
    console.log(`${client.user?.tag} でログインしました。`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = commands[interaction.commandName];
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        })
    }
});

client.login(process.env.DISCORD_TOKEN);