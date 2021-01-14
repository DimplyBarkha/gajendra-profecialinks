const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(1000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
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
  inputs: [
    {
      name: 'keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'Keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'results',
      description: 'the minimum number of results required',
      type: 'number',
    },
  ],
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    transform,
    domain: 'lowes.ca',
    zipcode: '',
  },
  implementation,
};
