module.exports = {
  name: "üye",
  description: "Belirtilen kişiye abone üye verir.",
  execute(message, args) {
    // İlk önce rolleri tanımlayın
    const yetkiliRolID = "1145810214839386244"; 
    const aboneRolID = "671464569511608325"; 
    // Yetkileri kontrol edin: Yönetici yetkisi veya yetkili rolüne sahip olmalı
    if (
      !message.member.permissions.has("ADMINISTRATOR") &&
      !message.member.roles.cache.has(yetkiliRolID)
    ) {
      // İzinsiz komut kullanımı mesajını gönder
      message.reply("Bu komutu kullanma izniniz yok.").then((sentMessage) => {
        // 5 saniye sonra izinsiz komut kullanım mesajını sil
        setTimeout(() => {
          sentMessage.delete();
        }, 5000); // 5 saniye = 5000 milisaniye
      });
      return;
    }
    // Etiketlenen kişiyi alın
    const target = message.mentions.members.first();
    // Eğer hiç kimse etiketlenmemişse, mesajı yanıtla
    if (!target) {
      // Etiketsiz kullanım mesajını gönder
      message
        .reply("Lütfen rol verilecek kişiyi etiketleyin.")
        .then((sentMessage) => {
          // 5 saniye sonra etiketsiz kullanım mesajını sil
          setTimeout(() => {
            sentMessage.delete();
          }, 5000); // 5 saniye = 5000 milisaniye
        });
      return;
    }
    // Abone rolünü etiketlenen kişiye verin
    const aboneRol = message.guild.roles.cache.get(aboneRolID);
    if (!aboneRol) {
      // Rol bulunamadı mesajını gönder
      message
        .reply("Üye rolü bulunamadı. Lütfen sunucu ayarlarını kontrol edin.")
        .then((sentMessage) => {
          // 5 saniye sonra rol bulunamadı mesajını sil
          setTimeout(() => {
            sentMessage.delete();
          }, 5000); // 5 saniye = 5000 milisaniye
        });
      return;
    }
    // Etiketlenen kişiye abone rolünü verin
    target.roles
      .add(aboneRol)
      .then(() => {
        // Başarılı rol verme mesajını gönder
        const successMessage = `${target.user.tag} kişisine başarıyla üye rolü verildi.`;
        message.react("✅");
        message.reply(successMessage).then((sentMessage) => {
          // 5 saniye sonra başarılı rol verme mesajını sil
          setTimeout(() => {
            sentMessage.delete();
          }, 3000); // 5 saniye = 5000 milisaniye
        });
      })
      .catch((error) => {
        console.error(error);
        // Hata mesajını gönder
        message
          .reply("Üye rolü verirken bir hata oluştu.")
          .then((sentMessage) => {
            // 5 saniye sonra hata mesajını sil
            setTimeout(() => {
              sentMessage.delete();
            }, 3000); // 5 saniye = 5000 milisaniye
          });
      });
  },
};
