const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

async function checkTokens(tokens, useProxy = false, proxyUrl = null) {
    const validTokens = [];
    const invalidTokens = [];
    const russianTokens = [];
    const spammedTokens = [];
    const notSpammedTokens = [];
    const emptyTokens = [];
    const billingTokens = [];
    const notRussian = [];
    const verifiedNumbers = [];
    const notverifiedNumbers = [];
    let dms = 0;
  

   const axiosConfig = {};

  if (useProxy && proxyUrl) {
    axiosConfig.httpsAgent = new HttpsProxyAgent(proxyUrl);
  }

  let startTime = new Date();
  await Promise.all(
    tokens.map(async (token) => {
      try {
        const [response, responses] = await Promise.all([
          axios({
            method: 'GET',
            url: 'https://discord.com/api/v9/users/@me',
            headers: {
              Authorization: token,
            },
            ...axiosConfig,
          }),
          axios({
            method: 'GET',
            url: 'https://discord.com/api/v9/users/@me/channels',
            headers: {
              Authorization: token,
            },
          }),
        ]);

        if (responses.status === 200) {
          dms += responses.data.length;
          if (responses.data.length < 8) {
            emptyTokens.push(token);
          }
        }

        if (response.status === 200) {
          const data = response.data;
          if (data.username) {
            validTokens.push(token);

            if (data.premium_type === 2) {
              billingTokens.push(token);
            }

            if (data.locale === 'ru') {
              russianTokens.push(token);
            } else {
              notRussian.push(token);
            }

            if (data.phone !== null) {
              verifiedNumbers.push(token);
            }

            if (data.phone === null) {
              notverifiedNumbers.push(token);
            }

            let totalMessages = 0;
            let messagesWithLink = 0;

            await Promise.all(
              responses.data.map(async (channel) => {
                const channelMessagesResponse = await axios({
                  method: 'GET',
                  url: `https://discord.com/api/v9/channels/${channel.id}/messages`,
                  headers: {
                    Authorization: token,
                  },
                });

                if (channelMessagesResponse.status === 200) {
                  const messages = channelMessagesResponse.data;
                  totalMessages += messages.length;
                  for (const message of messages) {
                    if (message.content && message.content.includes('discord.gg')) {
                      messagesWithLink++;
                    }
                  }
                }
              })
            );

            if (messagesWithLink > 5) {
              spammedTokens.push(token);
            } else {
              notSpammedTokens.push(token);
            }
          }
        } else {
          invalidTokens.push(token);
        }
      } catch (error) {
        invalidTokens.push(token);
      }
    })
  );

  const endTime = new Date();
  const timeSpent = (endTime - startTime) / 1000;

  return {
    valid: validTokens,
    invalid: invalidTokens,
    russian: russianTokens,
    spammed: spammedTokens,
    notSpammed: notSpammedTokens,
    notRussian: notRussian,
    empty: emptyTokens,
    billing: billingTokens,
    numbers: verifiedNumbers,
    nonumbers: notverifiedNumbers,
    dm: dms,
    time: timeSpent,
  };
}
