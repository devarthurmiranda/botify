const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('githubinfo')
		.setDescription('Fetches repository details from GitHub')
		.addStringOption(option =>
			option.setName('repo')
				.setDescription('Repository in the format owner/repo (e.g., nodejs/node)')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply(); // Defer in case the API call takes time

		const repoInput = interaction.options.getString('repo');

		try {
			// Fetch repository data
			const repoResponse = await axios.get(`https://api.github.com/repos/${repoInput}`);
			const repoData = repoResponse.data;
			
			// Fetch latest commits (we'll take the first commit as the latest)
			const commitsResponse = await axios.get(`https://api.github.com/repos/${repoInput}/commits`);
			const commitsData = commitsResponse.data;
			const latestCommit = commitsData[0];

			// Build an embed with the repository details
			const embed = new EmbedBuilder()
				.setTitle(repoData.full_name)
				.setURL(repoData.html_url)
				.setDescription(repoData.description || 'No description provided')
				.addFields(
					{ name: 'Stars', value: repoData.stargazers_count.toString(), inline: true },
					{ name: 'Forks', value: repoData.forks_count.toString(), inline: true },
					{ name: 'Open Issues', value: repoData.open_issues_count.toString(), inline: true },
					{ name: 'Last Commit', value: latestCommit ? `[${latestCommit.commit.message.split('\n')[0]}](${latestCommit.html_url})` : 'No commits found', inline: false },
					{ name: 'Updated At', value: new Date(repoData.updated_at).toLocaleString(), inline: true }
				)
				.setFooter({ text: 'Data fetched from GitHub API' })
				.setColor(0x24292e);

			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.error('Error fetching repository details:', error);
			await interaction.editReply('⚠️ Error fetching repository details. Please ensure the repository exists and is in the correct format (owner/repo).');
		}
	},
};
