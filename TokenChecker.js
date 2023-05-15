const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

async function checkTokens(tokens, useProxy = false, proxyUrl = null) {
  const validTokens = [];
  const invalidTokens = [];
  const russianTokens = [];
  const spammedTokens = [];
  const emptyTokens = [];
  const billingTokens = [];

  const axiosConfig = {};

  if (useProxy && proxyUrl) {
    axiosConfig.httpsAgent = new HttpsProxyAgent(proxyUrl);
  }

  for (const token of tokens) {
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://discord.com/api/v9/users/@me',
        headers: {
          Authorization: token,
        },
        ...axiosConfig,
      });

      if (response.status === 200) {
        console.log(response)
        const data = response.data;
        if (data.username) {
          validTokens.push(token);

          if (data.premium_type === 2) {
            billingTokens.push(token);
          }

          if (data.locale === 'ru') {
            russianTokens.push(token);
          }
        } else {
          emptyTokens.push(token);
        }
      } else {
        invalidTokens.push(token);

        if (response.status === 429) {
          spammedTokens.push(token);
        }
      }
    } catch (error) {
      invalidTokens.push(token);
    }
  }

  return {
    valid: validTokens,
    invalid: invalidTokens,
    russian: russianTokens,
    spammed: spammedTokens,
    empty: emptyTokens,
    billing: billingTokens,
  };
}

module.exports = checkTokens;
