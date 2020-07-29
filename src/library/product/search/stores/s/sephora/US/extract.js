const { transform } = require('../../../../shared');
// const { transform } = require('../format');


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
  implementation
};

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
    while (scrollTop !== 9000) {
      // await stall(2500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      console.log("SCROLLING")
      if (scrollTop === 9000) {
        break;
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 10000));



  return await context.extract(productDetails, { transform });
}