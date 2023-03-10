const { SlashCommandSubcommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js-light')
const schema = require('../../../models/economy-model.js')
const schemaBank = require('../../../models/bank-model.js')

/**
 * @type {import('../../types/typeslash').Command}
 */

const command = {
	userPerms: ['SEND_MESSAGES'],
	botPerms: ['SEND_MESSAGES'],
	category: 'Economía',

	data: new SlashCommandSubcommandBuilder()
		.setName('with')
		.setDescription('Retira dinero de tu banco!')
		.addStringOption((o) =>
			o.setName('cantidad').setDescription('Cantidad a retirar!').setRequired(true),
		),
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */

	async run(client, interaction) {
		const resultsWallet = await schema.findOne({
			guildid: interaction.guild.id,
			userid: interaction.user.id,
		})
		const resultsBank = await schemaBank.findOne({
			guildid: interaction.guild.id,
			userid: interaction.user.id,
		})
		let money = parseInt(interaction.options.getString('cantidad'))

		const err = new MessageEmbed().setTitle(':x: Error').setColor('RED')

		if ((!['all', 'max'].includes(money) && isNaN(money)) || (!['all', 'max'].includes(money) && !Number.isInteger(money))) {
			err.setDescription('Debes poner un numero valido!')
			return interaction.reply({ embeds: [err], ephemeral: true })
		}
		if (['all', 'max'].includes(money)) money = resultsBank.money
		if (money && money < 1) {
			err.setDescription('Debes poner un numero mayor a 0!')
			return interaction.reply({ embeds: [err], ephemeral: true })
		}
		if (!resultsBank || resultsBank.money === 0) {
			err.setDescription('No tienes dinero para retirar!')
			return interaction.reply({ embeds: [err], ephemeral: true })
		}
		if (resultsBank.money < parseInt(money)) {
			err.setDescription('No tienes suficiente dinero para retirar!')
			return interaction.reply({ embeds: [err], ephemeral: true })
		}

		if (resultsBank) {
			if (resultsWallet) {
				const addEco = parseInt(money) + parseInt(resultsWallet.money)
				const rmvBank = parseInt(resultsBank.money) - parseInt(money)

				await schema.updateOne(
					{
						guildid: interaction.guild.id,
						userid: interaction.user.id,
					},
					{
						money: addEco,
					},
				)
				await schemaBank.updateOne(
					{
						guildid: interaction.guild.id,
						userid: interaction.user.id,
					},
					{
						money: rmvBank,
					},
				)
				const embed = new MessageEmbed()
					.setTitle('✅ Dinero retirado!')
					.setDescription(
						`**${interaction.user.username}** ha retirado \`${money}$\` del banco`,
					)
					.setColor('GREEN')
				interaction.reply({ embeds: [embed] })
			}
		} else if (!resultsBank || resultsBank === 0) {
			const embed2 = new MessageEmbed()
				.setTitle(':x: Oh no!')
				.setDescription('No tienes dinero suficiente')
				.setColor('RED')
			return interaction.reply({ embeds: [embed2], ephemeral: true })
		}
	},
}

module.exports = command
