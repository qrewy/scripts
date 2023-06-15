const axios = require('axios');

async function changeBio(token, newBio) {
  try {
    const response = await axios({
      method: 'PATCH',
      url: 'https://discord.com/api/v9/users/@me',
      headers: {
        Authorization: token,
      },
      data: {
        bio: newBio,
      },
    });

    if (response.status === 200) {
      console.log('Успешно');
    } else {
      console.log('Ошибка', response.status);
    }
  } catch (error) {
    console.log('Ошибка:', error.message);
  }
}

changeBio("", "Салам");
