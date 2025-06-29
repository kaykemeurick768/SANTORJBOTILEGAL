
const { Client, GatewayIntentBits, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    console.log(`Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand() && interaction.commandName === 'registrar') {
        const modal = new ModalBuilder()
            .setCustomId('form_registro')
            .setTitle('Registro Ilegal - SantaRJ');

        const inputId = new TextInputBuilder()
            .setCustomId('player_id')
            .setLabel('🆔 Seu ID (FiveM)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const inputFac = new TextInputBuilder()
            .setCustomId('faccao')
            .setLabel('🏷️ Nome da Facção')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const inputCargo = new TextInputBuilder()
            .setCustomId('cargo')
            .setLabel('🎖️ Cargo na facção (01 ou 02)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(inputId);
        const row2 = new ActionRowBuilder().addComponents(inputFac);
        const row3 = new ActionRowBuilder().addComponents(inputCargo);

        modal.addComponents(row1, row2, row3);
        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'form_registro') {
        const id = interaction.fields.getTextInputValue('player_id');
        const faccao = interaction.fields.getTextInputValue('faccao');
        const cargo = interaction.fields.getTextInputValue('cargo');

        const embed = new EmbedBuilder()
            .setTitle('📥 Nova Solicitação de Setagem')
            .setColor('Red')
            .addFields(
                { name: '🆔 ID do Jogador', value: id, inline: true },
                { name: '🏷️ Facção', value: faccao, inline: true },
                { name: '🎖️ Cargo', value: cargo, inline: true },
                { name: '👤 Solicitante', value: `${interaction.user.tag} (<@${interaction.user.id}>)` }
            )
            .setFooter({ text: 'SantaRJ - Sistema de Setagem' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('aprovar').setLabel('✅ Aprovar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('recusar').setLabel('❌ Recusar').setStyle(ButtonStyle.Danger)
        );

        const canal = await client.channels.fetch('1388538876397879537');
        await canal.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: '✅ Sua solicitação foi enviada para análise da staff.', ephemeral: true });
    }

    if (interaction.isButton()) {
        const originalEmbed = interaction.message.embeds[0];
        const userAction = interaction.user.tag;
        let status = "";

        if (interaction.customId === 'aprovar') {
            status = "✅ Aprovado por " + userAction;
        } else if (interaction.customId === 'recusar') {
            status = "❌ Recusado por " + userAction;
        }

        const updatedEmbed = EmbedBuilder.from(originalEmbed)
            .setColor(interaction.customId === 'aprovar' ? 'Green' : 'Red')
            .addFields({ name: '📌 Status', value: status });

        await interaction.update({ embeds: [updatedEmbed], components: [] });
    }
});

client.login(process.env.TOKEN);
