const { transform } = require('../format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    transform,
    domain: 'davidjones.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    async function paginate() {
      try {
        await context.evaluate(async () => {
          const element = document.querySelector('button[data-tb-sid="st_infinite-button"]');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            console.log('**** Scrolling it *****')
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
        });
        const hasNextLink = await context.evaluate((selector) => !!document.querySelector('button[data-tb-sid="st_infinite-button"]'));
        if (hasNextLink) {
          await context.click('button[data-tb-sid="st_infinite-button"]'),
            await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.log(error);
      }
    }
    let length = await context.evaluate(async function () {
      return document.querySelectorAll('div[data-tb-sid*="st_result-container-wrapper"]').length;
    });
    let oldLength = 0;
    while (length && length !== oldLength && length <= 150) {
      oldLength = length;
      await paginate();
      length = await context.evaluate(async function () {
        return document.querySelectorAll('div[data-tb-sid*="st_result-container-wrapper"]').length;
      });
    }
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
