const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'ag_parfetts',
    transform,
    domain: 'online.parfetts.co.uk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    // if (document.querySelector('#__next > div.undefined.page-wrapper > div.main-header > div > div.main-column > div > div.col.right-wrapper > div > div.col.login-links > a:nth-child(1)')) {
      await context.waitForSelector('#__next > div.undefined.page-wrapper > div.main-header > div > div.main-column > div > div.col.right-wrapper > div > div.col.login-links > a:nth-child(1)');
      await context.click('#__next > div.undefined.page-wrapper > div.main-header > div > div.main-column > div > div.col.right-wrapper > div > div.col.login-links > a:nth-child(1)');
    // }
    // if (document.querySelector('div.main-column form > div:nth-child(3) > div > div > input')) {
      await context.waitForSelector('div.main-column form > div:nth-child(3) > div > div > input');
      await context.setInputValue('div.main-column form > div:nth-child(3) > div > div > input', `print@parfetts.co.uk`);
      await context.waitForSelector('div.main-column  form > div:nth-child(4) > div > div > input');
      await context.setInputValue('div.main-column  form > div:nth-child(4) > div > div > input', `parfettssupplier`);
      await context.waitForSelector('#__next > div.undefined.page-wrapper > div.column-wrapper.main-content-wrapper > div.main-column > div > div > div > div > div > form > div:nth-child(5) > div > button');
      await context.click('#__next > div.undefined.page-wrapper > div.column-wrapper.main-content-wrapper > div.main-column > div > div > div > div > div > form > div:nth-child(5) > div > button');
    // }
    // if (document.querySelector('[class="infinite-scroll-pagination"]')) {
      await context.waitForSelector('[class="infinite-scroll-pagination"]');
    // }
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 30000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  }
};
