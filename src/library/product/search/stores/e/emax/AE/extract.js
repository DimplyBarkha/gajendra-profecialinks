const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    transform,
    domain: 'emaxme.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    async function paginate () {
      try {
        await context.evaluate(async () => {
          const element = document.querySelector('div.footer');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        });
        const hasNextLink = await context.evaluate((selector) => !!document.querySelector('a[title="Next"]'));
        console.log('hasnextLink=>', hasNextLink);
        if (hasNextLink) {
          console.log('in if loop hasnextLink=>', hasNextLink);
          const element2 = document.querySelector('a[title="Next"]');
          element2.click();
          // await context.click('a[title="Next"]');
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        }
      } catch (error) {
        console.log(error);
      }
    }
    let length = await context.evaluate(async function () {
      return document.querySelectorAll('div[class*=product-item-info]').length;
    });
    let oldLength = 0;
    while (length && length !== oldLength && length <= 80) {
      oldLength = length;
      await paginate();
      length = await context.evaluate(async function () {
        return document.querySelectorAll('div[class*=product-item-info]').length;
      });
    }
    await new Promise(resolve => setTimeout(resolve, 30000));
    return await context.extract(productDetails, { transform });
  },
};
