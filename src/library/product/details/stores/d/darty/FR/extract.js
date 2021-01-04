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
    window.scroll(0, 1000);
    if (document.querySelector('li#brand_navigation_item a')) {
      document.querySelector('li#brand_navigation_item a').click();
      if (document.querySelector('button.btn-expand.btn-reset img[src]')) {
        document.querySelector('button.btn-expand.btn-reset img[src]').click();
        await new Promise(resolve => setTimeout(resolve, 500));
        let scrollTop = 0;
        let lastscrollvalue = 0;
        while (scrollTop !== 7000) {
          await stall(750);
          lastscrollvalue = scrollTop;
          scrollTop += 1000;
          window.scroll(lastscrollvalue, scrollTop);
          if (scrollTop === 7000) {
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
