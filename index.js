const { Client, Intents, GatewayIntentBits, MessageActionRow, Modal, TextInputComponent, MessageButton, MessageEmbed } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.MESSAGE_CONTENT],
});

const fetch = require('node-fetch');
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();
const db = require('croxydb');
const { join } = require('path');
const axios = require('axios');
const acilma_zamani = Date.now();
const acilis_saat = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


const burhan = '853130594351317002';
const pusat = "755502281486762045";
const serverId = '671463820329484309'; // Sunucu ID'si
const aboneyetkilisi = '1145810214839386244';  //abone yetkilisi
const uye = '671464569511608325';  //üye rolü
const kiymetlidost = '1145810526572650505';
//const girilecekses = "1190730436004028416";  //botun gireceği ses kanalı
const giriscikiskanali = '1188962656468598786'; //giriş çıkış kanalı
const duyurukanali = '750484375241621505'; //duyuru kanalı
let yetkilimsj = 0; //yetkili sohbet kanalında yazılan mesaj sayısı
let ytkluyari = 0;  //yetkililerin çok konuştuğu için yediği uyarılar
const prefix = "ss-"; //botun prefixi
const Silent_Night = 'https://cdn.glitch.global/f11b02a2-b3b9-447e-b814-068c7e04b629/Silent_Night_v1.68_.lua?v=1714226007291'; //Silent Night Dosya Yolu
const OP_Recovery = 'https://cdn.glitch.global/f11b02a2-b3b9-447e-b814-068c7e04b629/OP_Recovery_V2.1_2.lua?v=1714226258432'; //OP Recovery Dosya Yolu
const acilis = '1381672065689714768'; 

const yetkilialim = "1198611735368716298";
const banlog = "1385934558603509790";
const whitelist = [
  burhan,
  "564365037955842049",
  "809951593892937738"
];
const banyetkili = [
  "671464565191475232"
];

const banSayaç = new Map(); // kullanıcı bazlı sayaç
let sonSifirlama = Date.now(); // fallback
let genelBanSayısı = 0;

const sayaçDosyaYolu = "./banSayac.json";

if (fs.existsSync(sayaçDosyaYolu)) {
  const veri = JSON.parse(fs.readFileSync(sayaçDosyaYolu, "utf8"));
  if (veri.sayaclar) {
    for (const userId in veri.sayaclar) {
      banSayaç.set(userId, veri.sayaclar[userId]);
    }
  }
  if (veri.sonSifirlama) {
    sonSifirlama = veri.sonSifirlama;
  }
}

function sayaçDosyasınaYaz() {
  const obj = {};
  for (const [id, count] of banSayaç) {
    obj[id] = count;
  }

  const veri = {
    sayaclar: obj,
    sonSifirlama: sonSifirlama
  };

  fs.writeFileSync(sayaçDosyaYolu, JSON.stringify(veri, null, 2));
}
const birSaat = 60 * 60 * 1000;

if (Date.now() - sonSifirlama >= birSaat) {
  banSayaç.clear();
  sonSifirlama = Date.now();
  sayaçDosyasınaYaz();
}



// Türkiye saatini API'den al
async function getTurkeyTimeFromAPI() {
    try {
        const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Turkey');
        const data = await res.json();
        const saat = `${data.hour.toString().padStart(2, '0')}:${data.minute.toString().padStart(2, '0')}:${data.seconds.toString().padStart(2, '0')}`;
        const tarih = `${data.day}.${data.month}.${data.year}`;
        return { saat, tarih };
    } catch (err) {
        console.error('Saat API isteği başarısız:', err);
        return { saat: 'Bilinmiyor', tarih: 'Bilinmiyor' };
    }
}

// Komut işleyici
client.commands = new Map();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}


client.once("ready", async() => { //ready
  console.log(`Bot olarak giriş yaptım: ${client.user.tag}`);
  
    const { saat, tarih } = await getTurkeyTimeFromAPI();

    const channel = client.channels.cache.get(acilis);
    channel.send(`Tarih: **${tarih}**\nSaat: **${saat} (TR)**`);
  
  client.user.setActivity({
        name: 'Xhanger Çekilişimiz Aktif!',
        type: 'WATCHING',
        largeImageKey: 'lethal',
        largeImageText: 'Lethal Gang',
    });
  client.user.setStatus("idle");
  if (channel) channel.send("🔁 Bot açıldığında sayaçlar zaman aşımı nedeniyle sıfırlandı.");

  


/*  setInterval(() => {
    client.channels.cache.get(duyurukanali).sendTyping(); //duyurulara yazıyor gözükme
    }, 5 * 1000);*/
  
  
});
//website kısmı
app.get("/", (request, response) => {
  console.log("7/24 Tutmak İçin Tekrar Aktif Oldum!");

  response.sendStatus(200);
});
app.listen(8000);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000); //website son

// Komut Çalıştırma
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();
  if (!content.startsWith(prefix)) return;
  const commandName = content.slice(prefix.length).split(" ")[0];
  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);
  const args = content
    .slice(prefix.length + commandName.length)
    .trim()
    .split(/ +/);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("Komutu çalıştırırken bir hata oluştu.");
  }
}); //komut çalıştırma son


client.login(process.env.token);

//BOT IVIR ZIVIRI BİTTİ


//aktiflik
client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'aktiflik') {
        if (message.author.id !== burhan) return
        const now = Date.now();
        const uptime = now - acilma_zamani;

        const seconds = Math.floor((uptime / 1000) % 60);
        const minutes = Math.floor((uptime / (1000 * 60)) % 60);
        const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        const uptimeStr = `${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye`;

        message.reply(`**${uptimeStr}**`);
    }
});

//linkengel
client.on("messageCreate", (message) => {
  if (message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.has(aboneyetkilisi)) return;
   //if (message.channel.id == '1188958469261361203' ) return;
  const linkRegex = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  let link = message.content.toLowerCase().replace(/@everyone/g, "(everyone)").replace(/@here/g, "(here)");
  if (linkRegex.test(message.content)) {
    message.guild.channels.cache.get("1198622510950928464").send(`${message.author} tarafından link gönderildi. Mesaj: \n ${link} `);
    message.delete().catch(console.error);
    message.author.send("Link attığınız için mesajınız silinmiştir. Link atmak yasaktır.");
  }
});

//reklam engel
client.on("messageCreate", (message) => {
  if (message.member.permissions.has("ADMINISTRATOR")) return;
  const reklam = ["discord.gg", "discordgg", "discord.com/invite", "discord.com/invite/"];
  let content = message.content.toLowerCase().replace(/@everyone/g, "(everyone)").replace(/@here/g, "(here)");
  if (reklam.some(word => content.includes(word))) {
    message.delete().catch(console.error);
    message.author.send("Sunucu daveti attığınız belirlendi. Yetkililere bildirildi.");
    message.guild.channels.cache.get("1198622510950928464").send(`${message.author} tarafından reklam yapıldı. Mesaj: \n ${content} `);
  }
});
//linkler son

      //basvuru
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
	if (!interaction.member.permissions.has("ADMINISTRATOR")) return;

	const basvuruembed = new MessageEmbed()
      .setColor("#ffffff")
      .setTitle("Yetkili Alım Başvurusu")
      .setDescription("Yetkili Alıma Başvurmak İçin Aşağıdaki Butonu Kullanabilirsiniz. Lütfen Başvurunuzun Geçerli Olması İçin Bütün Alanları Doldurunuz.")

		const basvurubutonn = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('basvurubuton')
					.setLabel('Başvurmak İçin Basınız!')
					.setStyle('SUCCESS'),
			);

		await interaction.channel.send({
  embeds: [basvuruembed],
  components: [basvurubutonn]
      
})
	}
});

client.on("interactionCreate", async interaction => {
  if(!interaction.isButton()) return;
  const modal = new Modal()
            .setCustomId('myModal')
            .setTitle('Yetkili Alım Formu');
        const isimInput = new TextInputComponent()
            .setCustomId('isim')
            .setLabel("İsminiz Nedir?")
            .setStyle('SHORT');
        const yasInput = new TextInputComponent()
            .setCustomId('yas')
            .setLabel("Kaç Yaşındasınız?")
            .setStyle('SHORT');
        const aktiflikInput = new TextInputComponent()
            .setCustomId('aktiflik')
            .setLabel("Günde Kaç Saat Aktif Olabilirsiniz?")
            .setStyle('SHORT');
        const isimsorusu = new MessageActionRow().addComponents(isimInput);
        const yassorusu = new MessageActionRow().addComponents(yasInput);
        const aktifliksorusu = new MessageActionRow().addComponents(aktiflikInput);
        modal.addComponents(isimsorusu, yassorusu, aktifliksorusu);
  if(interaction.customId === "basvurubuton"){
      await interaction.showModal(modal);
  }
})

client.on('interactionCreate', async interaction => {
        if (!interaction.isModalSubmit()) return;
        if(interaction.customId === "myModal"){
          await interaction.reply({ content: 'Başvurunuz Alınmıştır. Teşekürler!', ephemeral: true });
            const isim = interaction.fields.getTextInputValue('isim');
          const yas = interaction.fields.getTextInputValue('yas');
          const aktiflik = interaction.fields.getTextInputValue('aktiflik');
          const kullanan = interaction.user;
          interaction.guild.channels.cache.get("1198611735368716298").send(`Başvuru Bilgileri:\n > Başvuran Kişi: ${kullanan}\n > İsim: ${isim}\n > Yaş: ${yas}\n > Aktiflik Saati: ${aktiflik}`);
        }
    }); //başvuru son


//ss-yetkili
client.on('messageCreate', async (message) => {
    if (message.guild.id === serverId && message.member.roles.cache.has(aboneyetkilisi)) {
        let messageCounts = db.get(`messageCounts_${message.guild.id}`) || {};
        if (!messageCounts[message.author.id]) {
            messageCounts[message.author.id] = 1;
        } else {
            messageCounts[message.author.id]++;
        }
        db.set(`messageCounts_${message.guild.id}`, messageCounts);
}
        if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'yetkili') {
        if (!message.member.permissions.has("ADMINISTRATOR")) {// && !message.member.roles.cache.has(admin) && !message.member.roles.cache.has(gang)
            return message.reply('Bu komutu kullanma izniniz yok!');
        }

        let messageList = 'Mesaj sayıları:\n';
        let messageCounts = db.get(`messageCounts_${message.guild.id}`) || {};
        const guild = await client.guilds.fetch(serverId);
        guild.members.fetch().then((members) => {
            members.forEach((member) => {
                if (member.roles.cache.has(aboneyetkilisi)) {
                    const count = messageCounts[member.id] || 0;
                    messageList += `*${member.displayName}* (${member.user.tag}) : ${count} mesaj\n`;
                }
            })
            message.channel.send(messageList);
        });
    }
});


//otorol
client.on('guildMemberAdd', async member => {
    if (member.guild.id !== serverId) return;
    const role = member.guild.roles.cache.get(uye);
    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Role "${role.name}" added to ${member.user.tag}`);
          const embed = new MessageEmbed()
         .setTitle('Rol Verildi')
         .setDescription(`${role.name} rolü başarıyla ${member} kullanıcısına verildi.`)
         .setColor('#00ff00')
	       .setFooter(`${member.user.tag} - Lethal Gang © 2024`);
				
            const channel = member.guild.channels.cache.get(giriscikiskanali);
            if (channel) {
                channel.send({ embeds: [embed] });
            } else {
                console.error(`Channel with ID "${giriscikiskanali}" not found.`);
            }
        } catch (error) {
            console.error('Error adding role to member:', error);
        }
    } else {
        console.error(`Role with ID "${uye}" not found.`);
    }
});//otorol son

// Hilenin Dosyaları
client.on('messageCreate', message => {
    if (message.content === '!sn'|| message.content === '!silent'||message.content === '!night'||message.content === '!silentnight') {
            message.channel.send({
            files: [{
                attachment: Silent_Night,
                name: 'Silent_Night_v1.68_.lua'
            }]
        })
        .then(() => console.log('Dosya gönderildi'))
        .catch(error => console.error('Hata:', error));
    }
      if (message.content === '!op'|| message.content === '!oprecovery'|| message.content === '!recovery') {
            message.channel.send({
            files: [{
                attachment: OP_Recovery,
                name: 'OP_Recovery_V2.1_2.lua'
            }]
        })
        .then(() => console.log('Dosya gönderildi'))
        .catch(error => console.error('Hata:', error));
    }
});//dosyalar son






client.on('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı.`);
});

// /deneme komutu
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'deneme') {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) return;

 const cekilisEmbed = new MessageEmbed()
  .setColor("#ffffff")
  .setTitle("5 Kişiye 5 Günlük Xhanger Çekilişi")
  .setDescription("Çekilişe katılmak için aşağıdaki butona basarak formu doldurabilirsiniz.\nAşağıdaki şartara uymadan yapılan başvurular geçersiz sayılır. Kazandıktan sonra eğer şartları yerine getirmemiş olduğunuz tespit edilirse şartları yerine getirmeniz istenmez, başvurular arasından tekrar çekiliş yapılır.")
  .addField(
    "Çekilişe Katılım Şartları",
    "1. **Kıymetli Dost** Rolüne sahip olmanız gerekir. (Kıymetli Dost rolü almak için:  <#1190608727296978978>)\n2. Xhanger hesabınızı açarken [PusatBey Referans linkini](https://www.xhanger.co/reference/PusatBey) kullanmanız gerekir",
    true
  );
    const cekilisButon = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('cekilisbuton')
        .setLabel('Çekilişe Katılmak İçin Tıklayınız!')
        .setStyle('SUCCESS')
    );

    await interaction.reply({
      embeds: [cekilisEmbed],
      components: [cekilisButon],
      ephemeral: false
    });
  }
});

// Buton tıklanınca modal göster
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'cekilisbuton') return;

  const modal = new Modal()
    .setCustomId('cekilis')
    .setTitle('Çekiliş Formu');

  const isimInput = new TextInputComponent()
    .setCustomId('isim')
    .setLabel("Xhanger kullanıcı adınız nedir?")
    .setStyle('SHORT');

  const mailInput = new TextInputComponent()
    .setCustomId('mail')
    .setLabel("Xhanger hesabınızın mail adresini nedir?")
    .setStyle('SHORT');

  const row1 = new MessageActionRow().addComponents(isimInput);
  const row2 = new MessageActionRow().addComponents(mailInput);

  modal.addComponents(row1, row2);
  await interaction.showModal(modal);
});

// Modal gönderilince veriyi DB'ye kaydet
client.on('interactionCreate', async interaction => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId !== 'cekilis') return;

  const member = interaction.guild.members.cache.get(interaction.user.id);
  const hasRole = member.roles.cache.has(kiymetlidost);

  if (!hasRole) {
    return await interaction.reply({
      content: 'Kıymetli Dost rolüne sahip olmadığınız için çekilişe katılamazsınız. Lütfen önce Abone SS kanalından rol alın.',
      ephemeral: true
    });
  }

  const isim = interaction.fields.getTextInputValue('isim');
  const mail = interaction.fields.getTextInputValue('mail');

  // DB'ye kayıt (kullanıcı ID'sine göre)
  db.set(`cekilis_${interaction.user.id}`, {
    userTag: interaction.user.tag,
    userID: interaction.user.id,
    isim: isim,
    mail: mail,
    timestamp: Date.now()
  });

  await interaction.reply({
    content: '✅ Çekilişe Katılım Formunuz Alınmıştır. Teşekkürler!',
    ephemeral: true
  });
});


//cekilis
client.on('messageCreate', async message => {
  if (!message.content.startsWith('!')) return;
  if (message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'cekilis') {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply("❌ Bu komutu kullanmak için `Yönetici` yetkisine sahip olmalısın.");
    }

    const entries = Object.entries(db.all());
    const cekilisler = entries
      .filter(([key]) => key.startsWith("cekilis_"))
      .map(([key, value], index) => {
        const { userTag, isim, mail } = value;
        return `**${index + 1}. Başvuru**\n> 👤 Discord: \`${userTag}\`\n> 🧾 Kullanıcı Adı: \`${isim}\`\n> 📧 Mail: \`${mail}\``;
      });

    if (cekilisler.length === 0) {
      return message.reply("📭 Henüz hiç başvuru yapılmamış.");
    }

    // Embed başına 10 başvuru
    const chunkSize = 10;
    for (let i = 0; i < cekilisler.length; i += chunkSize) {
      const currentChunk = cekilisler.slice(i, i + chunkSize);

      const embed = new MessageEmbed()
        .setTitle(`📋 Çekiliş Başvuruları (${i + 1}-${Math.min(i + chunkSize, cekilisler.length)})`)
        .setColor("BLUE")
        .setDescription(currentChunk.join("\n\n"))
        .setFooter({ text: `Sayfa ${Math.floor(i / chunkSize) + 1} • Toplam Başvuru: ${cekilisler.length}` });

      await message.channel.send({ embeds: [embed] });
    }
  }
});


//eğlenmelik spotify komutu
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

if (command === 'spotify') {
//  if (message.author.id !== burhan) return message.reply('only burhan');

  try {
   const member = await message.guild.members.fetch(message.member.id).catch(() => null);
  //  if (!member) return message.reply('burhan nerde amk');

    const presence = member.presence;
    if (!presence) return message.reply('Durum?');

    const spotify = presence.activities.find(a => a.type === 'LISTENING' && a.name === 'Spotify');
    if (!spotify) return message.reply('Spotify dinlemiyorsun.');

    const song = spotify.details || 'Bilinmiyor';
    const artist = spotify.state || 'Bilinmiyor';

    message.channel.send(`**Şarkı:** ${song}\n**Sanatçı:** ${artist}`);
  } catch (error) {
    console.error(error);
    message.reply('Bir hata oluştu.');
  }
}
});


let korumaAktif = true; // Başlangıçta aktif

const kanalSilmeSayaç = new Map();
const kanalOlusturmaSayaç = new Map();
const rolSilmeSayaç = new Map();
const rolOlusturmaSayaç = new Map();

// Koruma aç/kapat komutu
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  if (message.content === "ss-koruma") {
    if (![burhan, pusat].includes(message.author.id)) {
      return message.reply("Bu komutu sadece yetkili kişiler kullanabilir.");
    }
    
    korumaAktif = !korumaAktif;
    const durum = korumaAktif ? "aktif" : "kapalı";
    await message.reply(`Koruma sistemleri başarıyla **${durum}** hale getirildi.`);
  }
});

// Kanal Silme
client.on("channelDelete", async (channel) => {
  if (!korumaAktif) return;
  if (channel.guild.id !== serverId) return;

  const logs = await channel.guild.fetchAuditLogs({ type: "CHANNEL_DELETE", limit: 1 });
  const entry = logs.entries.first();
  if (!entry) return;

  const executor = entry.executor;
  if (!executor || executor.id === channel.guild.ownerId || whitelist.includes(executor.id)) return; 

  const silinen = (kanalSilmeSayaç.get(executor.id) || 0) + 1;
  kanalSilmeSayaç.set(executor.id, silinen);

  const kanalAdi = channel.name || "Bilinmeyen Kanal";

  await uyarVeYaptirimUygula("kanal silme", silinen, executor, channel.guild, kanalAdi, kanalSilmeSayaç);
});

// Kanal Oluşturma
client.on("channelCreate", async (channel) => {
  if (!korumaAktif) return;
  if (channel.guild.id !== serverId) return;

  const logs = await channel.guild.fetchAuditLogs({ type: "CHANNEL_CREATE", limit: 1 });
  const entry = logs.entries.first();
  if (!entry) return;

  const executor = entry.executor;
 if (!executor || executor.id === channel.guild.ownerId || whitelist.includes(executor.id)) return; 

  const olusturulan = (kanalOlusturmaSayaç.get(executor.id) || 0) + 1;
  kanalOlusturmaSayaç.set(executor.id, olusturulan);

  const kanalAdi = channel.name || "Bilinmeyen Kanal";

  await uyarVeYaptirimUygula("kanal oluşturma", olusturulan, executor, channel.guild, kanalAdi, kanalOlusturmaSayaç);
});

// Rol Silme
client.on("roleDelete", async (role) => {
  if (!korumaAktif) return;
  if (role.guild.id !== serverId) return;

  const logs = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE", limit: 1 });
  const entry = logs.entries.first();
  if (!entry) return;

  const executor = entry.executor;
  if (!executor || executor.id === role.guild.ownerId || whitelist.includes(executor.id)) return;

  const silinen = (rolSilmeSayaç.get(executor.id) || 0) + 1;
  rolSilmeSayaç.set(executor.id, silinen);

  const rolAdi = role.name || "Bilinmeyen Rol";

  await uyarVeYaptirimUygula("rol silme", silinen, executor, role.guild, rolAdi, rolSilmeSayaç);
});

// Rol Oluşturma
client.on("roleCreate", async (role) => {
  if (!korumaAktif) return;
  if (role.guild.id !== serverId) return;

  const logs = await role.guild.fetchAuditLogs({ type: "ROLE_CREATE", limit: 1 });
  const entry = logs.entries.first();
  if (!entry) return;

  const executor = entry.executor;
  if (!executor || executor.id === role.guild.ownerId || whitelist.includes(executor.id)) return;

  const olusturulan = (rolOlusturmaSayaç.get(executor.id) || 0) + 1;
  rolOlusturmaSayaç.set(executor.id, olusturulan);

  const rolAdi = role.name || "Bilinmeyen Rol";

  await uyarVeYaptirimUygula("rol oluşturma", olusturulan, executor, role.guild, rolAdi, rolOlusturmaSayaç);
});

// Ortak Fonksiyon
async function uyarVeYaptirimUygula(tur, sayi, executor, guild, isim, sayaç) {
  try {
    const burhanUser = await client.users.fetch(burhan);
    const pusatUser = await client.users.fetch(pusat);
    const mesaj = `${executor.tag} tarafından "${isim}" isimli ${tur} işlemi yapıldı. (Toplam: ${sayi})`;

    if (sayi === 3 || sayi === 4) {
      await burhanUser.send(mesaj);
      await pusatUser.send(mesaj);
    }

    if (sayi === 4) {
      const member = await guild.members.fetch(executor.id).catch(() => null);
      if (!member) return;

      try {
        const rolleri = member.roles.cache.filter(r => r.editable && r.id !== guild.id);
        for (const [id] of rolleri) await member.roles.remove(id);

        await burhanUser.send(`${executor.tag} kullanıcısının tüm rolleri alındı.`);
        await pusatUser.send(`${executor.tag} kullanıcısının tüm rolleri alındı.`);
      } catch {
        try {
          await member.ban({ reason: `${tur} limiti aşıldı.` });
          await burhanUser.send(`${executor.tag} banlandı (roller alınamadı).`);
          await pusatUser.send(`${executor.tag} banlandı (roller alınamadı).`);
        } catch {
          await burhanUser.send(`⚠️ ${executor.tag} ne banlanabildi ne roller alınabildi.`);
          await pusatUser.send(`⚠️ ${executor.tag} ne banlanabildi ne roller alınamadı.`);
        }
      }
    }
  } catch (e) {
    console.error("Bildirim gönderilemedi:", e);
  }

  // Sayaç 1 saat sonra sıfırlanır
  setTimeout(() => {
    sayaç.delete(executor.id);
  }, 60 * 60 * 1000);
}


// Ban Komutu
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  if (message.guild.id !== serverId) return;
  if (!message.content.startsWith("ss-ban")) return;

  const args = message.content.split(" ").slice(1);
  const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  const reason = args.slice(1).join(" ") || "Sebep belirtilmedi.";
  const member = message.member;

  const hasPermission =
    whitelist.includes(member.id) ||
    member.roles.cache.some(role => banyetkili.includes(role.id)) ||
    member.permissions.has("ADMINISTRATOR");

  if (!hasPermission) return message.reply("Bu komutu kullanma yetkin yok.");
  if (!target) return message.reply("Banlanacak kişiyi belirtmelisin.");
  if (!target.bannable) return message.reply("Bu kişiyi banlayamıyorum.");
  
  if (target.roles.highest.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
  return message.reply("Aynen reis bana da touch blue.");
}

  const onayEmbed = new MessageEmbed()
    .setColor("RED")
    .setTitle("Ban Onayı")
    .setDescription(`**${target.user.tag}** kullanıcısını şu sebeple banlamak üzeresin:\n\`\`\`${reason}\`\`\`\nOnaylıyor musun?`);

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("ban_onay")
      .setLabel("✅ Onayla")
      .setStyle("SUCCESS"),
    new MessageButton()
      .setCustomId("ban_iptal")
      .setLabel("❌ İptal")
      .setStyle("DANGER")
  );

  const onayMesaj = await message.reply({ embeds: [onayEmbed], components: [row] });

  const filter = (i) => i.user.id === message.author.id && ["ban_onay", "ban_iptal"].includes(i.customId);
  const collector = onayMesaj.createMessageComponentCollector({ filter, time: 15000 });

  collector.on("collect", async (i) => {
    if (i.customId === "ban_iptal") {
      await i.update({ content: "🚫 Ban işlemi iptal edildi.", components: [], embeds: [] });
      return;
    }

    try {
      await target.ban({ reason: `${reason} | Yetkili: ${message.author.tag}` });
      await i.update({ content: `✅ ${target.user.tag} sunucudan banlandı.`, components: [], embeds: [] });

      if (!whitelist.includes(member.id)) {
        const mevcut = (banSayaç.get(member.id) || 0) + 1;
        banSayaç.set(member.id, mevcut);
        sayaçDosyasınaYaz();

        if (mevcut === 5) {
          message.channel.send("⚠️ Her saaat 5 kişi banlayabilirsin.");
        } else if (mevcut > 5) {
          try {
            await member.send("⛔ Saatlik ban limitini aştın. Artık ban atamazsın, lütfen 1 saat bekle.");
          } catch {}
          return;
        }
      }

      const logKanal = client.channels.cache.get(banlog);
      if (logKanal) {
        logKanal.send(`🔨 ${target.user.tag} banlandı\n• Yetkili: ${message.author.tag}\n• Sebep: ${reason}`);
      }

      genelBanSayısı++;
      if (genelBanSayısı === 11) {
        const burhanUser = await client.users.fetch(burhan);
        await burhanUser.send("⚠️ Sunucuda son 1 saatte 10'dan fazla kişi banlandı.");
      }

    } catch (err) {
      await i.update({ content: "❌ Ban işlemi başarısız oldu.", components: [], embeds: [] });
    }
  });

  collector.on("end", async (collected) => {
    if (!collected.size) {
      await onayMesaj.edit({ content: "⌛ Zaman aşımı. Ban işlemi yapılmadı.", components: [], embeds: [] });
    }
  });
});

// Sayaç sıfırlama sistemi
setInterval(async () => {
  if (banSayaç.size === 0 && genelBanSayısı === 0) return;

  for (const [userId] of banSayaç) {
    try {
      const user = await client.users.fetch(userId);
      const kanal = client.channels.cache.get(yetkilialim);
      if (kanal) kanal.send(`🔁 ${user.tag} için ban sayacı sıfırlandı.`);
    } catch {}
  }

  banSayaç.clear();
  genelBanSayısı = 0;
  sonSifirlama = Date.now();
  sayaçDosyasınaYaz();
}, 60 * 60 * 1000);
