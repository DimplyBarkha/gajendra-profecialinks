const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.com.au',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let count = document.querySelectorAll('div#quicksearch-search-results div.ais-hits--item').length;
        while (count < 150) {
          document.querySelector('.quicksearch-scrolling-container').scrollTop = document.querySelector('.quicksearch-scrolling-container').scrollHeight;

          await new Promise(resolve => setTimeout(resolve, 2000));
          const oldCount = count;
          count = document.querySelectorAll('div#quicksearch-search-results div.ais-hits--item').length;
          if (oldCount === count) {
            break;
          }
        }
      });
    };
    await applyScroll(context);

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
