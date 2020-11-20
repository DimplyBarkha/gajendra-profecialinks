const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  // kill cookie popup
  await context.evaluate(() => {
    if (document.querySelector('div.uc-banner-content')) {
      document.querySelector('button#uc-btn-accept-banner').click();
    }
  });

  // scrol to the end of the page
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(1000);
          break;
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
  };
  await applyScroll(context);

  await context.evaluate(() => {
    const addProp = (selector, iterator, propName, value) => {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };

    allProducts = document.querySelectorAll('a[class*="c3-product-grid__item"]');
    
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    transform: transform,
    domain: 'mpreis.at',
    zipcode: '',
  },
  implementation,
};
