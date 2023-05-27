const axios = require('axios');
const Bottleneck = require('bottleneck');


async function spamm(tokens, message) {
  for(const token of tokens) {
  const startTime = new Date();

  try {
    const response = await axios({
      method: 'GET',
      url: 'https://discord.com/api/v9/users/@me/channels', 
      headers: {
        Authorization: token,
      },
    });

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
            console.error(`Не получилось отправить сообщение в канал - ${channel.name}`);
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
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


spamm(["OTEyOTQwMDE3MTYzMzI5NTc3.GXwSvB.iom2UZ1LXLBTm_YPrfQHIMTzh0F65LGWaNfHdo"], 'всем салама лексус ребята:\nhttps://discord.gg/eyFQWBDg')                                                                
