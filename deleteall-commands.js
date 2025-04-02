require('dotenv').config();
const { REST, Routes } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID; // Your bot's application ID
const guildId = process.env.GUILD_ID; // If using guild-specific commands

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Removing all Slash Commands...');

        // Delete all GUILD commands
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });

        // Delete all GLOBAL commands (if needed)
        // await rest.put(Routes.applicationCommands(clientId), { body: [] });

        console.log('All commands have been removed.');
    } catch (error) {
        console.error('Error deleting commands:', error);
    }
})();
