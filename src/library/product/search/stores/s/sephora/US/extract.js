// const { transform } = require('../../../../shared');
const { transform } = require('../format');


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
    while (scrollTop !== 10000) {
      // await stall(2500);
      await new Promise(resolve => setTimeout(resolve, 5000));

      scrollTop += 1000;
      window.scroll(0, scrollTop);
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("SCROLLING")
      if (scrollTop === 10000) {
        break;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    // debugger
  });




  return await context.extract(productDetails, { transform });
}