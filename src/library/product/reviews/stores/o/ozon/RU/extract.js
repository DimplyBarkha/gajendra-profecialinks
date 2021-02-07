const { transform } = require('./../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;

  try {
    await context.waitForSelector('div.c4 div._2avF:nth-child(2) button', { timeout: 10000 });
  } catch (e) {
    console.log('Age confirmation popup not loaded');
  }
  await context.evaluate(async () => {
    const popUps = document.querySelector('div.c4 div._2avF:nth-child(2) button');
    if (popUps) {
      popUps.click();
    }
  });
  await context.evaluate(async () => {
    const reviewBlock = document.querySelectorAll('div.b7y3 div._3xol');
    if (reviewBlock.length > 0) {
      for (let j = 0; j < reviewBlock.length; j++) {
        const ratingValue = Math.round(parseInt(reviewBlock[j].style.width) / 20);
        reviewBlock[j].setAttribute('custom_rating', String(ratingValue));
      }
    }
  });
  // await new Promise(resolve => setTimeout(resolve, 2000));
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'ozon',
    transform,
    domain: 'ozon.ru',
    zipcode: '',
  },
  implementation,
};
