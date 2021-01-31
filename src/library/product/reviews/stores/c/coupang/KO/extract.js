async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  try {
    await context.waitForSelector('ul.tab-titles li[name="review"]', { timeout: 10000 });
  }
  catch (e) {
    console.log('error');
  }

    await context.evaluate(async function () {
        const reviewsButton = document.querySelector('ul.tab-titles li[name="review"]');
        if (reviewsButton) {
          reviewsButton.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 4000));
        } else {
          moreReviews = false;
        }
      
    });

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'KO',
    store: 'coupang',
    transform: null,
    domain: 'coupang.com',
    zipcode: '',
  },
  implementation,
};
