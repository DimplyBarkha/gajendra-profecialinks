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
        let currScroll = document.querySelector('.quicksearch-scrolling-container').scrollHeight;
        while (count < 150) {
          const oldScroll = currScroll;

          const loadMore = document.querySelector('div.ais-infinite-hits--showmore button.ais-infinite-hits--showmoreButton');
          if (loadMore) {
            document.querySelector('div.ais-infinite-hits--showmore button.ais-infinite-hits--showmoreButton').click();
          } else {
            document.querySelector('.quicksearch-scrolling-container').scrollBy(0, 1000);
          }
          await new Promise(resolve => setTimeout(resolve, 4000));
          currScroll = document.querySelector('.quicksearch-scrolling-container').scrollHeight;

          count = document.querySelectorAll('div#quicksearch-search-results div.ais-hits--item').length;
          if (oldScroll === currScroll) {
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
