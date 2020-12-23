const { transform } = require('../format');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  // try {
  //   await context.click('//div[contains(@class,"modal-content bg")]//button[@class="close"]//span[1]');
  // } catch (e) {
  //   console.log('no popup');
  // }
  // const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
  //   const timestamp = new Date(lastDate).getTime() - 30 * 24 * 60 * 60 * 1000;
  //   return new Date(reviewDate).getTime() > timestamp;
  // };
  // console.log('checkIfReviewIsFromLast30Days', checkIfReviewIsFromLast30Days);
  let reviewDate = '';
  const getReviewDate = (position) => {
    return context.evaluate(() => {
      try {
        reviewDate = document.querySelector('div.reviewer > p:nth-child(3)').innerText;
        return reviewDate;
      } catch (error) {
        console.log('no review date available');
      }
      // const reviewDateData = reviewDate.split('\n').pop();
      // console.log(reviewDateData);

    }, position);
  };
  const getNextLinkCheck = () => {
    return context.evaluate(() => {
      try {
        const getNextLinkSeelectorData = document.querySelector('a.pages:last-of-type').innerText === 'next';
        if (getNextLinkSeelectorData) {
          return document.querySelector(
            'a.pages:last-of-type');
        }
      } catch (error) {
        console.log('No next link selector available');
      }
    });
  };
  let getNextLinkTest = await getNextLinkCheck();
  const latestReviewDate = await getReviewDate('first');
  let lastReviewDate = await getReviewDate('last');
  console.log('lastReviewDate', latestReviewDate);
  while (getNextLinkTest
  ) {
    await context.extract(productReviews, { type: 'APPEND' });
    await context.click('a.pages:last-of-type');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    lastReviewDate = await getReviewDate('last');
    console.log('lastReviewDate', lastReviewDate);
    getNextLinkTest = await getNextLinkCheck();
  }
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    transform,
    domain: 'dermstore.com',
    zipcode: '',
  },
  implementation,
};
