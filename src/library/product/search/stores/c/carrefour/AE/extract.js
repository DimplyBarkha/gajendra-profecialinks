const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    transform,
    domain: 'carrefouruae.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let count = document.querySelectorAll('ul[data-testid="scrollable-list-view"] div[class="ltr-6hrfmx"]').length;

        while (count < 150) {
          const oldCount = count;
          document.querySelector('button.ltr-1upsixo') && document.querySelector('button.ltr-1upsixo').click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          count = document.querySelectorAll('ul[data-testid="scrollable-list-view"] div[class="ltr-6hrfmx"]').length;
          const scrollElement = document.querySelector('ul[data-testid="scrollable-list-view"] > li');
          await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          if (scrollElement) {
            scrollElement.scrollIntoView({ behaviour: 'smooth', block: 'end' });
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
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
