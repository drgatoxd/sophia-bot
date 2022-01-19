const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/inventory-model.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Economía',


    data: new SlashCommandBuilder()
    .setName("inv")
    .setDescription("Revisa tu inventario!")
    .addUserOption(o => o.setName("usuario").setDescription("Revisa el inventario de otro usuario, se curioso! jeje").setRequired(false)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

        const mencion = interaction.options.getUser("usuario") || interaction.user
        const results = await schema.findOne({
            guildid: interaction.guild.id, 
            userid: mencion.id
        });
        
        if(results && results.inventory.length > 0){
            const embedSuccess = new MessageEmbed()
            .setTitle("Inventario")
            .setDescription(
            "Para usar un producto escribe: `/use <numero-producto>`"+results.inventory.map((i, u) => `\n\n**#${u+1} ~ ${!i.product.toUpperCase().startsWith("<@") ? i.product.toUpperCase() : "ROL "+i.product.toUpperCase()}**\n${i.description}`
            ).toString().replace(/,/g, " "))
            .setColor("GREEN")
            .setFooter({text: results.inventory.length+" productos"})
            .setTimestamp();

            interaction.reply({embeds: [embedSuccess]});
        } else {
            const embedVacio = new MessageEmbed()
            .setTitle("Oh no!")
            .setDescription("El inventario se encuentra vacio :(")
            .setColor("RED");

            return interaction.reply({embeds: [embedVacio], ephemeral: true});
        }

    }
}

module.exports = command;