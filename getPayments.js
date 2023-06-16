const axios = require('axios')

async function getPayments(token) {
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://discord.com/api/v9/users/@me/billing/payment-sources',
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 200) {
      const paymentMethods = response.data;
      if (paymentMethods.length > 0) {
        paymentMethods.forEach((method) => {
          console.log(method);
        });
      } else {
        console.log('Не найдено привязаных платежных методов');
      }
    } else {
      console.log('Ошибка. Статус:', response.status);
    }
  } catch (error) {
    console.log('Ошибка:', error.message);
  }
}

getPayments('');
