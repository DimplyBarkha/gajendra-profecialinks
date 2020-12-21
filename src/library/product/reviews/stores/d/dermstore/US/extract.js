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

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  const currentUrl = await context.evaluate(async function () {
    const currentUrl = window.location.href;
    return currentUrl;
  });
  await context.goto(`${currentUrl}#reviews`);
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const currentUrlReview = window.location.href;
    const currentUrlReviewAdd = currentUrlReview + '#reviews';
    addHiddenDiv('Added_reviewUrl', currentUrlReviewAdd);
  });
  const checkIfReviewIsFromLast30Days = (lastDate, reviewDate) => {
    const timestamp = new Date(lastDate).getTime() - 30 * 24 * 60 * 60 * 1000;
    return new Date(reviewDate).getTime() > timestamp;
  };
  const getReviewDate = (position) => {
    return context.evaluate((position) => {
      let reviewDate = '';
      const reviewDateElement = document.querySelector(
        `li[itemprop="review"]:${position}-of-type meta[itemprop="datePublished"]`
      );

      if (reviewDateElement) {
        reviewDate = reviewDateElement.getAttribute('content');
      }
      return reviewDate;
    }, position);
  };

  const getNextLinkCheck = () => {
    return context.evaluate(() => {
      return document.querySelector(
        'div.pagination a:last-child'
      );
    });
  };
  const latestReviewDate = await getReviewDate('first');
  let lastReviewDate = await getReviewDate('last');
  let getNextLinkTest = await getNextLinkCheck();
  while (
    checkIfReviewIsFromLast30Days(latestReviewDate, lastReviewDate) &&
    getNextLinkTest
  ) {
    await context.extract(productReviews, { type: 'APPEND' });
    await context.click('div.pagination a:last-child');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    lastReviewDate = await getReviewDate('last');
    getNextLinkTest = await getNextLinkCheck();
  }

  return await context.extract(productReviews, { transform });
}
