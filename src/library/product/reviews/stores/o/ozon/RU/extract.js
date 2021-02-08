const { transform } = require('./../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;

  try {
    await context.waitForSelector('div.b0m1 div.ui-k4 button:first-child', { timeout: 10000 });
  } catch (e) {
    console.log('Age confirmation popup not loaded');
  }
  await context.evaluate(async () => {
    const popUps = document.querySelector('div.b0m1 div.ui-k4 button:first-child');
    if (popUps) {
      popUps.click();
    }
  });

  async function autoScroll () {
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
  await autoScroll();

  await context.evaluate(async () => {
    // while (document.querySelector('div.b7y4 button.ui-k6')) {
    //   document.querySelector('div.b7y4 button.ui-k6').click();
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    // }
    try {
      const totalReviews = parseInt(document.querySelector('div.b8r5').textContent);
      if (totalReviews > 10) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      if (document.querySelector('div.b7y4 button.ui-k6')) {
        let moreReviews = true;
        while (moreReviews) {
          document.querySelector('div.b7y4 button.ui-k6').click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          const currentReviewCount = document.querySelectorAll('div.b7y3').length;
          if (currentReviewCount >= totalReviews) {
            moreReviews = false;
          }
        }
      }
    } catch (e) {
      console.log('error in load more reviews');
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    const reviewBlock = document.querySelectorAll('div.b7y3 div.ui-a0d0');
    if (reviewBlock.length > 0) {
      for (let j = 0; j < reviewBlock.length; j++) {
        const ratingValue = Math.round(parseInt(reviewBlock[j].style.width) / 20);
        reviewBlock[j].setAttribute('custom_rating', String(ratingValue));
      }
    }
  });
  await new Promise(resolve => setTimeout(resolve, 2000));
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
