/*
client.on('interactionCreate', interaction => {
	console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
});
const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});*/





/* mod sohbete yazmayın aw
client.on('messageCreate', async (message) => {
  
  const kanalid = "1190993263818194964";
  const rolunidsi = '1145810214839386244';
	
    if (message.channel.id === kanalid) { //uyarı
        yetkilimsj++;
        if (yetkilimsj > "40") {
            const alertChannel = await message.guild.channels.cache.get(kanalid);
            if (alertChannel) {
                alertChannel.send(`<#808883299829284914> gitsenize aw`);
                yetkilimsj = 0;
                ytkluyari++;
            } else {
                console.error('Uyarı kanalı bulunamadı!');
            }
        }
      
      if (ytkluyari == 2) { //kanal kilitleme
        const alertChannel = await message.guild.channels.cache.get(kanalid);
        if (alertChannel) {
        alertChannel.permissionOverwrites.edit(rolunidsi, {
            SEND_MESSAGES: false
        });
        alertChannel.send(`Şimdi yazın lan`);
      
              setTimeout(() => {
            alertChannel.permissionOverwrites.edit(rolunidsi, {
                SEND_MESSAGES: null
            });
            alertChannel.send(`Unlock`);
        }, 5 * 60 * 1000);
        yetkilimsj = 0;
        ytkluyari = 0;
    } else {
        console.error('Uyarı kanalı bulunamadı!');
    }
}

   }
});
*/