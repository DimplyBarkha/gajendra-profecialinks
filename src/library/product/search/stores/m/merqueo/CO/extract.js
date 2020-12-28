const { transform } = require('../../../../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(async () => {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    // scroll

    let scrollTop = 0;
    const scrollLimit = 10000;
    await stall(3000);
    while (scrollTop <= scrollLimit) {
      scrollTop += 1006;
      window.scroll(0, scrollTop);
      await stall(1000);
    }



  });

  return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    transform,
    domain: 'merqueo.com',
    zipcode: '',
  },
  implementation,
};
