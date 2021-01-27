/* eslint-disable no-unmodified-loop-condition */
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    while (!document.querySelector('button[class*="loadMore"]') && !document.querySelector('div[class*="endOfList"]')) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let index = 0;
    let i = 0;
    let scrollTop = 0;
    while (index < 6) {
      i = index + 1;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (document.querySelector('div[class*="endOfList"]')) {
        while (scrollTop !== 5000 * i) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          scrollTop += 250;
          window.scroll(0, scrollTop);
          if (scrollTop === 5000 * i) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            break;
          }
        }
        break;
      }
      // @ts-ignore
      document.querySelector('button[class*="loadMore"]').click();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      while (scrollTop !== 5000 * i) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        scrollTop += 250;
        window.scroll(0, scrollTop);
        if (scrollTop === 5000 * i) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;
        }
      }
      index++;
    }
  });
  return await context.extract(productDetails, { transform });
}
