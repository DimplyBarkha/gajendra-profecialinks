module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'keshop',
    transform: null,
    domain: 'keshop.com',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain },
    context,
    dependencies,
  ) => {
    await context.evaluate(() => {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      stall(2000);
    });
    await context.evaluate(() => {
      const ratingString = document.querySelector('.comment_anchor > img');
      if (ratingString) {
        const ratingValueNormalized = ratingString.src.match(/\d+/)[0] / 2;
        ratingString.setAttribute('ratingNormalized', ratingValueNormalized);
      }
    });
    await context.extract(dependencies.productDetails);
  },
};
