const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageAttachment } = require('discord.js-light')
const { imagenesEspañol } = require('discord-memes')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	category: 'Diversión',

	data: new SlashCommandBuilder()
		.setName('memes')
		.setDescription('Diviertete con memes!'),
	// .setDescriptionLocalization('en-US', 'Have fun with memes'),

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const attachment = new MessageAttachment(imagenesEspañol(), 'meme.jpg')
		await interaction.reply({
			embeds: [
				new MessageEmbed().setImage('attachment://meme.jpg').setColor('RANDOM'),
			],
			files: [attachment],
		})
	},
}

module.exports = command
