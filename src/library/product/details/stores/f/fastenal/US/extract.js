// const { transform } = require('./format');
// module.exports = {
//   implements: 'product/details/extract',
//   parameterValues: {
//     country: 'US',
//     store: 'fastenal',
//     transform: transform,
//     domain: 'fastenal.com',
//     zipcode: '',
//   },
// };


const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'fastenal',
    domain: 'fastenal.com',
    transform

  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
   // await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(async function () {

      var url = window.location.href;
      document.body.setAttribute('productUrl', url);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};


