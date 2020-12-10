const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'keshop',
    transform: transform,
    domain: 'keshop.com',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.evaluate(async () => {
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
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

      stall(2000);
    });
    await context.evaluate(() => {
      const ratingString = document.querySelector('.comment_anchor > img');
      if (ratingString) {
        // @ts-ignore
        let ratingValueNormalized = ratingString.src.match(/\d+/)[0] / 2;
        const regex = /(\d).(\d)/;
        // @ts-ignore
        if (regex.test(ratingValueNormalized)) {
          console.log('egex');
          // @ts-ignore
          ratingValueNormalized = String(ratingValueNormalized).replace('.', ',');
          // @ts-ignore
          ratingString.setAttribute('ratingNormalized', ratingValueNormalized);
          return;
        }
        // @ts-ignore
        ratingString.setAttribute('ratingNormalized', ratingValueNormalized);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
