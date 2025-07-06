module.exports = {
    name: 'rolver',
    description: 'Hiçbir role sahip olmayanlara belirli bir rolü verir.',
    async execute(message) {
        try {
            // Yalnızca yönetici iznine sahip kullanıcıların komutu kullanmasına izin ver
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

            const roleID = '671464569511608325'; // Verilecek rolün ID'si
            message.channel.send("Rol verilecek üyeleri buluyorum...");

            // Belirtilen rolü al
            const role = message.guild.roles.cache.get(roleID);
            if (!role) {
                return message.channel.send('Belirtilen rol bulunamadı.');
            }

            // Tüm üyeleri getir (çevrimiçi ve çevrimdışı)
            await message.guild.members.fetch({ force: true });

            // Rolü olmayan üyeleri filtrele
            const membersWithoutRole = message.guild.members.cache.filter(member => member.roles.cache.size === 1);

            // Rolü olmayan üyelere rolü ekle
            await Promise.all(membersWithoutRole.map(member => {
                return member.roles.add(role)
                    .then(() => console.log(`Rol eklendi: ${member.user.tag}`))
                    .catch(error => console.error('Rol eklenemedi', error));
            }));

            message.channel.send(`Başarıyla ${membersWithoutRole.size} üyeye rol verildi.`);
        } catch (error) {
            console.error('Bir hata oluştu:', error);
            message.channel.send('Bir hata oluştu, rol verilemedi.');
        }
    },
};
