const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll20')
		.setDescription('Rola um dado de 20 lados!'),
	async execute(interaction) {
		const roll = Math.floor(Math.random() * 20) + 1;
		await interaction.reply(`🎲 Você rolou um ${roll}!`);
	},
};