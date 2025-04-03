const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize the OpenAI SDK to point to DeepSeek's endpoint.
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deepseek')
		.setDescription('Get an AI-generated answer from DeepSeek')
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('Enter your prompt')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply(); // Allow extra time for the API call

		const prompt = interaction.options.getString('prompt');

		try {
			const completion = await openai.chat.completions.create({
				messages: [
					{ role: "system", content: "You are a helpful assistant." },
					{ role: "user", content: prompt }
				],
				model: "deepseek-chat",
			});

			const answer = completion.choices[0].message.content;

      // If answer is too long for Discord messages, send it as a text file attachment.
      if (answer.length > 2000) {
        const fileName = 'deepseek-answer.txt';
        const buffer = Buffer.from(answer, 'utf-8');
        await interaction.editReply({
          content: '**DeepSeek Answer is too long, please see the attached file.**',
          files: [{
            attachment: buffer,
            name: fileName
          }]
        });
      } else {
        await interaction.editReply(`**DeepSeek Answer:**\n${answer}`);
      }
		} catch (error) {
			console.error("Error fetching DeepSeek answer:", error.response ? error.response.data : error.message);
			await interaction.editReply("⚠️ Error fetching answer from DeepSeek. Please try again later.");
		}
	},
};
