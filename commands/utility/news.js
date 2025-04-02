const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('news')
		.setDescription('Fetches the latest top tech news from Hacker News'),
		
	async execute(interaction) {
		await interaction.deferReply(); // Defer reply in case fetching takes time

		try {
			// Fetch top stories from Hacker News API
			const { data: topStories } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
			
			// Get details of the top 3 stories
			const newsPromises = topStories.slice(0, 3).map(id =>
				axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
			);

			const news = await Promise.all(newsPromises);
			const newsList = news.map(article => article.data);

			// Format the message
			const newsMessage = newsList.map((item, index) => 
				`**${index + 1}. [${item.title}](${item.url})** - ${item.by}`
			).join("\n");

			await interaction.editReply(`📰 **Top Tech News from Hacker News**:\n${newsMessage}`);
		} catch (error) {
			console.error("Error fetching news:", error);
			await interaction.editReply("⚠️ Failed to fetch news. Try again later.");
		}
	},
};
