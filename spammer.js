const axios = require('axios');
const Bottleneck = require('bottleneck');


async function spamm(token, message) {
  const startTime = new Date();

  try {
    const response = await axios({
      method: 'GET',
      url: 'https://discord.com/api/v9/users/@me/channels', 
      headers: {
        Authorization: token,
      },
    });

    let ids = []
    for (let i = 0; i < response.data.length; i++) {
        setTimeout(() => {
        axios.post(`https://discord.com/api/channels/${response.data[i].id}/messages`, { content: `${message}` }, {
            headers: {
                'Authorization': token
            }
        }).catch(e => {})
    }, i * 1000);
      }
} catch (e) {
    console.log(e)
}

  try {
    const guildsResponse = await axios({
      method: 'GET',
      url: 'https://discord.com/api/v9/users/@me/guilds',
      headers: {
        Authorization: token,
      },
    });

    const guilds = guildsResponse.data;

    for (const guild of guilds) {
      const channelsResponse = await axios({
        method: 'GET',
        url: `https://discord.com/api/v9/guilds/${guild.id}/channels`,
        headers: {
          Authorization: token,
        },
      });

      const channels = channelsResponse.data;
      for (const channel of channels) {
        if (channel.type === 0) {
          try {
            await axios({
              method: 'POST',
              url: `https://discord.com/api/v9/channels/${channel.id}/messages`,
              headers: {
                Authorization: token,
                'Content-Type': 'application/json',
              },
              data: {
                content: message,
              },
            });

            console.log(`Успешно отправил сообщение в канал - ${channel.name}`);
          } catch (error) {
            console.error(`Не получилось отправить сообщение в канад - ${channel.name}`);
          }

          await delay(500);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  const endTime = new Date();
  const timeSpent = (endTime - startTime) / 1000;
  console.log(`Потрачено времени: ${timeSpent} сек.`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


spamm("MTA3NDAzMDM2MTE4MjQ4NjU4MA.G0BT0s.QItlUz01MaIXLTcIK4rwEt2s2xH6m6BuZWAU1I", 'всем салама лексус ребята')                                                                
