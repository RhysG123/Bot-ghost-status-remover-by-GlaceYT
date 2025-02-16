/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         
                                                                       
☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆


*/
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
});

const app = express();
const port = 3000;
app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});
app.listen(port, () => {
  console.log('\x1b[36m[ SERVER ]\x1b[0m', '\x1b[32m SH : http://localhost:' + port + ' ✅\x1b[0m');
});

const statusMessages = ["Overseeing Liberty State Roleplay", "Hosted @ Rhys' Customs"];
const statusTypes = [ 'online', 'online'];
let currentStatusIndex = 0;
let currentTypeIndex = 0;

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log('\x1b[36m[ LOGIN ]\x1b[0m', `\x1b[32mLogged in as: ${client.user.tag} ✅\x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[35mBot ID: ${client.user.id} \x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mConnected to ${client.guilds.cache.size} server(s) \x1b[0m`);
  } catch (error) {
    console.error('\x1b[31m[ ERROR ]\x1b[0m', 'Failed to log in:', error);
    process.exit(1);
  }
}

function updateStatus() {
  const currentStatus = statusMessages[currentStatusIndex];
  const currentType = statusTypes[currentTypeIndex];
  client.user.setPresence({
    activities: [{ name: currentStatus, type: ActivityType.Custom }],
    status: currentType,
  });
  console.log('\x1b[33m[ STATUS ]\x1b[0m', `Updated status to: ${currentStatus} (${currentType})`);
  currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length;
  currentTypeIndex = (currentTypeIndex + 1) % statusTypes.length;
}

function heartbeat() {
  setInterval(() => {
    console.log('\x1b[35m[ HEARTBEAT ]\x1b[0m', `Bot is alive at ${new Date().toLocaleTimeString()}`);
  }, 30000);
}

client.once('ready', () => {
  console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mPing: ${client.ws.ping} ms \x1b[0m`);
  updateStatus();
  setInterval(updateStatus, 10000);
  heartbeat();
});

login();

  
/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         
                                                                       
☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆


*/


require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ]
});

// Slash command definitions
const commands = [
    new SlashCommandBuilder().setName('ssu').setDescription('Start a server session').addStringOption(option => option.setName('message').setDescription('Custom announcement').setRequired(false)),
    new SlashCommandBuilder().setName('ssd').setDescription('Stop a server session').addStringOption(option => option.setName('message').setDescription('Custom shutdown message').setRequired(false)),
    new SlashCommandBuilder().setName('ssuvote').setDescription('Start an SSU vote').addStringOption(option => option.setName('message').setDescription('Custom vote message').setRequired(false)),
    new SlashCommandBuilder().setName('ban').setDescription('Ban a user').addUserOption(option => option.setName('target').setDescription('User to ban').setRequired(true)),
    new SlashCommandBuilder().setName('unban').setDescription('Unban a user').addStringOption(option => option.setName('userid').setDescription('User ID to unban').setRequired(true)),
    new SlashCommandBuilder().setName('kick').setDescription('Kick a user').addUserOption(option => option.setName('target').setDescription('User to kick').setRequired(true)),
    new SlashCommandBuilder().setName('mute').setDescription('Mute a user').addUserOption(option => option.setName('target').setDescription('User to mute').setRequired(true)),
    new SlashCommandBuilder().setName('unmute').setDescription('Unmute a user').addUserOption(option => option.setName('target').setDescription('User to unmute').setRequired(true)),
    new SlashCommandBuilder().setName('warn').setDescription('Warn a user').addUserOption(option => option.setName('target').setDescription('User to warn').setRequired(true)),
    new SlashCommandBuilder().setName('purge').setDescription('Delete messages').addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete').setRequired(true)),
    new SlashCommandBuilder().setName('lockchannel').setDescription('Lock the current channel'),
    new SlashCommandBuilder().setName('unlockchannel').setDescription('Unlock the current channel'),
    new SlashCommandBuilder().setName('announce').setDescription('Make an announcement').addStringOption(option => option.setName('message').setDescription('Announcement message').setRequired(true)),
    new SlashCommandBuilder().setName('serverinfo').setDescription('Show server info'),
    new SlashCommandBuilder().setName('channelinfo').setDescription('Show channel info').addChannelOption(option => option.setName('channel').setDescription('Channel to get info about').setRequired(false)),
    new SlashCommandBuilder().setName('roleadd').setDescription('Add a role to a user').addUserOption(option => option.setName('target').setDescription('User to give role to').setRequired(true)).addStringOption(option => option.setName('role').setDescription('Role name').setRequired(true)),
    new SlashCommandBuilder().setName('roleremove').setDescription('Remove a role from a user').addUserOption(option => option.setName('target').setDescription('User to remove role from').setRequired(true)).addStringOption(option => option.setName('role').setDescription('Role name').setRequired(true)),
    new SlashCommandBuilder().setName('poll').setDescription('Start a poll').addStringOption(option => option.setName('question').setDescription('Poll question').setRequired(true)),
];

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        const guildId = 'YOUR_GUILD_ID'; // Replace with your server's ID
        await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commands.map(cmd => cmd.toJSON()) });
        console.log('🚀 Slash commands registered!');
    } catch (error) {
        console.error('Failed to register slash commands:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, user, channel } = interaction;
    const startTime = Date.now();

    if (['ssu', 'ssd', 'ssuvote'].includes(commandName)) {
        const titles = { ssu: 'Session!', ssd: 'Shutdown!', ssuvote: 'Session Vote!' };
        const colors = { ssu: 'Green', ssd: 'Red', ssuvote: 'Blue' };
        const descriptions = {
            ssu: 'The staff team has decided to launch a Server Startup. Do you have what it takes for the most realistic server? Join now!',
            ssd: 'Unfortunately our staff team is unable to moderate the Server anymore. You're not permitted to join during this period.',
            ssuvote: 'The LSRP Staff Team is taking votes for a server startup! If you vote, you MUST join within 15 minutes. Let's vote up LSRP!',
        };

        const customMessage = options.getString('message') || descriptions[commandName];

        const embed = new EmbedBuilder()
            .setTitle(titles[commandName])
            .setDescription(`${customMessage}

**Time Elapsed:** 0 seconds`)
            .setColor(colors[commandName])
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        // Update the embed every second
        const interval = setInterval(async () => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const updatedEmbed = new EmbedBuilder()
                .setTitle(titles[commandName])
                .setDescription(`${customMessage}

**Time Elapsed:** ${elapsed} seconds`)
                .setColor(colors[commandName])
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setTimestamp();

            message.edit({ embeds: [updatedEmbed] });
        }, 1000);

        // Stop updating after 1 hour
        setTimeout(() => clearInterval(interval), 3600000);
    }

    if (commandName === 'ban') {
        const target = options.getUser('target');
        const member = await interaction.guild.members.fetch(target.id);
        await member.ban();
        interaction.reply(`🚫 ${target.tag} has been banned.`);
    }

    if (commandName === 'unban') {
        const userId = options.getString('userid');
        await interaction.guild.bans.remove(userId);
        interaction.reply('✅ User has been unbanned.');
    }

    if (commandName === 'kick') {
        const target = options.getUser('target');
        const member = await interaction.guild.members.fetch(target.id);
        await member.kick();
        interaction.reply(`👢 ${target.tag} has been kicked.`);
    }

    if (commandName === 'mute') {
        const target = options.getMember('target');
        await target.timeout(600000);
        interaction.reply(`🔇 ${target.user.tag} has been muted.`);
    }

    if (commandName === 'unmute') {
        const target = options.getMember('target');
        await target.timeout(null);
        interaction.reply(`🔊 ${target.user.tag} has been unmuted.`);
    }

    if (commandName === 'warn') {
        const target = options.getUser('target');
        interaction.reply(`⚠️ ${target.tag} has been warned.`);
    }

    if (commandName === 'purge') {
        const amount = options.getInteger('amount');
        const messages = await channel.bulkDelete(amount, true);
        interaction.reply(`🗑️ Deleted ${messages.size} messages.`);
    }

    if (commandName === 'lockchannel') {
        await channel.permissionOverwrites.create(interaction.guild.roles.everyone, { SendMessages: false });
        interaction.reply('🔒 This channel has been locked.');
    }

    if (commandName === 'unlockchannel') {
        await channel.permissionOverwrites.create(interaction.guild.roles.everyone, { SendMessages: true });
        interaction.reply('🔓 This channel has been unlocked.');
    }

    if (commandName === 'announce') {
        const message = options.getString('message');
        interaction.reply(`📢 **Announcement:** ${message}`);
    }

    if (commandName === 'serverinfo') {
        const { name, memberCount, createdAt, ownerId } = interaction.guild;
        interaction.reply(`📌 **Server Name:** ${name}\n👥 **Members:** ${memberCount}\n📅 **Created On:** ${createdAt.toDateString()}\n👑 **Owner ID:** ${ownerId}`);
    }

    if (commandName === 'channelinfo') {
        const targetChannel = options.getChannel('channel') || channel;
        interaction.reply(`📂 **Channel Name:** ${targetChannel.name}\n📌 **Channel ID:** ${targetChannel.id}\n📅 **Created On:** ${targetChannel.createdAt.toDateString()}`);
    }

    if (commandName === 'roleadd') {
        const target = options.getMember('target');
        const roleName = options.getString('role');
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        await target.roles.add(role);
        interaction.reply(`✅ Added ${role.name} to ${target.user.tag}`);
    }

    if (commandName === 'roleremove') {
        const target = options.getMember('target');
        const roleName = options.getString('role');
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        await target.roles.remove(role);
        interaction.reply(`❌ Removed ${role.name} from ${target.user.tag}`);
    }

    if (commandName === 'poll') {
        const question = options.getString('question');
        const pollMessage = await interaction.reply({ content: `📊 **Poll:** ${question}`, fetchReply: true });
        await pollMessage.react('👍');
        await pollMessage.react('👎');
    }
});

client.login(process.env.DISCORD_TOKEN);



