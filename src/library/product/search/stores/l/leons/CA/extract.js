const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'leons',
    transform,
    domain: 'leons.ca',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.waitForSelector('div[class*="findify-components-common--grid"] div[class*=grid__column]', {timeout: 20000});
    } catch(er) {
      console.log(er.message);
    }
    await context.evaluate(async function() {
      const hasProducts = document.querySelector('span[class*=zero-results__sorry]');
      if(hasProducts) {
        throw new Error('No results found');
      }
    })
    async function paginate() {
      try {
        await context.evaluate(async () => {
          const element = document.querySelector('div[id="footer"]');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            console.log('**** Scrolling it *****')
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
        });
        await context.evaluate(async () => {
          const element = document.querySelector('button[class*="next-button"]');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            console.log('**** Scrolling it *****')
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
        });
        const hasNextLink = await context.evaluate((selector) => !!document.querySelector('button[class*="next-button"]'));
        if (hasNextLink) {
          await context.click('button[class*="next-button"]'),
            await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.log(error);
      }
    }
    let length = await context.evaluate(async function () {
      return document.querySelectorAll('div[class*="_column"]').length;
    });
    let oldLength = 0;
    while (length && length !== oldLength && length <= 150) {
      oldLength = length;
      await paginate();
      length = await context.evaluate(async function () {
        return document.querySelectorAll('div[class*="_column"]').length;
      });
    }
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await context.extract(productDetails, { transform });
  },
};
