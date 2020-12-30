const { transform } = require('../NL/shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { transform } = parameters;
  await context.evaluate(async function (context) {
    document.body.setAttribute('search-url', window.location.href);
    let scrollTop = 0;
    while (scrollTop !== 50000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 50000) {
        await stall(2000);
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
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    transform,
    domain: 'bijenkorf.nl',
    zipcode: '',
  },
  implementation,
};
