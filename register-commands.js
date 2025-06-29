
const { SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('registrar')
        .setDescription('Solicitar setagem no ilegal')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🔁 Registrando comandos...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Comando /registrar registrado com sucesso!');
    } catch (error) {
        console.error(error);
    }
})();
