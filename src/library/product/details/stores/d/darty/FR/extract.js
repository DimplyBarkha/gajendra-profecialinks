const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    if (document.querySelector('li#brand_navigation_item > a')) {
      document.querySelector('li#brand_navigation_item > a').click();
      if (document.querySelector('button.btn-expand.btn-reset img[src]')) {
        document.querySelector('button.btn-expand.btn-reset img[src]').click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        let scrollTop = 0;
        while (scrollTop !== 5000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 5000) {
            await stall(500);
            break;
          }
        }
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    transform,
    domain: 'darty.com',
    zipcode: '',
  },
  implementation,
};
