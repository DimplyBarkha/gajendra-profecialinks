const { transform } = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    transform,
    domain: 'tmall.ru',
    zipcode: '',
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.evaluate(async () => {
        console.log('Scroll to recommendatrions section');
        function timeout(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }

        if (document.querySelector('.bottom-recommendation')) {
          document.querySelector('.bottom-recommendation').scrollIntoView();
          console.log('Waiting for 3 seconds.');
          await timeout(5000);
        }
      });
    } catch (er) {
      console.log('Failed to scroll to bottom of page', er);
    }
    return await context.extract(productDetails, { transform });
  },
};
