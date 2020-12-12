const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  const { transform } = parameters;

  const onReviewsPage = await context.evaluate(() => {
    return window.location.href.includes('/product-reviews');
  });

  if (onReviewsPage) {
    await context.waitForSelector('li[class="a-last"]', { timeout: 7000 })
      .catch(() => console.log('On last page'));
  }

  const data = await context.extract(productReviews, { transform });

  if (!onReviewsPage) {
    // await context.clickAndWaitForNavigation('a[data-hook="see-all-reviews-link-foot"]', { timeout: 15000 }, { waitUntil: 'load' });
    const reviewSuffix = await context.evaluate(() => {
      return document.querySelector('a[data-hook="see-all-reviews-link-foot"]').getAttribute('href');
    });
    await context.goto(`https://www.amazon.co.uk${reviewSuffix}`, { timeout: 20000, waitUntil: 'load' });
  }

  return data;
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
    zipcode: '',
  },
  implementation,
};
