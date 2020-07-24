const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }
    // document.querySelectorAll('.price-group-wrapper').forEach(item => {
    //   let price = item.querySelector('span.fop-price') ? item.querySelector('span.fop-price').innerHTML : '';
    //   if (price.includes('p')) {
    //     price = `£${price.match(/\d+/g) / 100}`;
    //   }
    //   item.setAttribute('price', price);
    // });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform: transform,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
  implementation,
};
