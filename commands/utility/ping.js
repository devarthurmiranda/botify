const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Teste de conexão!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};