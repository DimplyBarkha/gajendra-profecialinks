const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kidkraft',
    transform: transform,
    domain: 'kidkraft.com',
    zipcode: "''",
  },
   implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      let readmore = document.querySelector('div.morecontent button');
      console.log("here is tyui",readmore);
      if (readmore) {
        readmore.click();
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};