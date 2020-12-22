const { transform } = require('../format');

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
async function implementation (inputs, parameters, context, dependencies) {
  //h3[@itemprop="headline"]
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
  // const nextXpath = document.querySelector('a.pages:last-of-type').innerText;
  const nextXpath = await context.evaluate(async () => {
    return document.querySelector('a.pages:last-of-type').innerText;
  });
  console.log('nextXpath', nextXpath === 'next');
  const getNextLinkCheck = () => {
    return context.evaluate(() => {
      return document.querySelector(
        'a.pages:last-of-type'
      );
    });
  };
  let getNextLinkTest = await getNextLinkCheck();
  console.log('nextXpath', nextXpath === 'next');
  console.log('getNextLinkTest', getNextLinkTest);

  while (getNextLinkTest
  ) {
    if (nextXpath === 'next') {
      await context.extract(productReviews, { type: 'APPEND' });
      await context.click('a.pages:last-of-type');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // lastReviewDate = await getReviewDate('last');
      getNextLinkTest = await getNextLinkCheck();
    }
  }
  return await context.extract(productReviews, transform);
}
