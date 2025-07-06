module.exports = {
  name: "kurals",
  description: "Belirtilen kişiye abone rolü verir.",
  execute(message, args) {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      // İzinsiz komut kullanımı mesajını gönder
      message.reply("Bu komutu kullanma izniniz yok.").then((sentMessage) => {
        // 5 saniye sonra izinsiz komut kullanım mesajını sil
        setTimeout(() => {
          sentMessage.delete();
        }, 5000); // 5 saniye = 5000 milisaniye
      });
      return;
    }
    message.channel.send("discord.gg/bankasya");
  /* const { MessageEmbed } = require("discord.js");
    const kurallarEmbed = new MessageEmbed()
      .setColor("#ffffff")
      .setTitle("Kıymetli Dost Rolünü Almak")
      .setDescription(
        "<@&1145810526572650505> rolünü alarak sunucumuzda bazı ayrıcalıklara ve bazı gizli kanallara erişebilirsiniz. Bu rolü alabilmek için yalnızca birkaç şartımız var. Bu şartlar aşağıda listelendi. Bu şartları yerine getirip <#1140336707099709582> kanalına şartları yerine getirdiğinizi kanıtlayan ekran görüntüsünü attığınız taktirde <@&1145810214839386244> rolüne sahip yetkililer size rolü verecektir."
      )
      .addField(
        "Kıymetli Dost rolünü alabilmek için şartlar neler?",
        "1. [Lqcut Youtube Kanalına](https://youtube.com/@Lqcut?si=2GE1RQYpDUKWx9Cf) abone olmak.\n2. Son videoya like atmak."
      )
      .addField(
        "\u200B \n<#1140336707099709582> Kanalına atmanız gereken örnek ekran görüntüsü aşağıdadır:",
        "\u200B"
      )
      .setImage(
        "https://media.discordapp.net/attachments/853230373706006539/1190629298768453743/image.png?ex=65a27ef1&is=659009f1&hm=1bd332c73d1352e5a3ab2d335e08f041cb4b1046c5cdc5fd8e296c99e569ec34&=&format=webp&quality=lossless"
      )
      // .addField('2. Spam', '> Spam yapmak yasaktır.')
      //  .addField('3. Reklam', '> Yetkiliden izinsiz reklam yapmak yasaktır.')
      //  .addField('4. Saygısızlık ve Hakaret', '> Başkalarına saygısızlık yapmak, hakaret etmek yasaktır.')
      .setFooter("Lethal Gang © 2024");
    message.channel.send({ embeds: [kurallarEmbed] });*/
  },
};
