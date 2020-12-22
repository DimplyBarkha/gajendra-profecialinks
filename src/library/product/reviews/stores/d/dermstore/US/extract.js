const { transform } = require('../format');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  // const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
  //   const timestamp = new Date(lastDate).getTime() - 30 * 24 * 60 * 60 * 1000;
  //   return new Date(reviewDate).getTime() > timestamp;
  // };
  // const getReviewDate = (position) => {
  //   return context.evaluate((position) => {
  //     let reviewDate = '';
  //     const reviewDateElement = document.querySelector(
  //       `li[itemprop="review"]:${position}-of-type meta[itemprop="datePublished"]`
  //     );

  //     if (reviewDateElement) {
  //       reviewDate = reviewDateElement.getAttribute('content');
  //     }
  //     return reviewDate;
  //   }, position);
  // };
  const getNextLinkCheck = () => {
    return context.evaluate(() => {
      if (document.querySelector(
        'a.pages:last-of-type').innerText === 'next') {
        return document.querySelector(
          'a.pages:last-of-type');
      }
    });
  };
  let getNextLinkTest = await getNextLinkCheck();
  // const latestReviewDate = await getReviewDate('first');
  // let lastReviewDate = await getReviewDate('last');
  while (getNextLinkTest
  ) {
    await context.extract(productReviews, { type: 'APPEND' });
    await context.click('a.pages:last-of-type');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // lastReviewDate = await getReviewDate('last');
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
