const { transform } = require('../format');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform,
    filterReviews: null,
    domain: 'walmart.com',
    zipcode: '',
  },
  // implementation: async (
  //   inputs,
  //   parameters,
  //   context,
  //   dependencies) => {
  //   const { transform } = parameters;
  //   const { productReviews } = dependencies;
  //   await context.evaluate(function () {
  //     console.log(document.querySelectorAll('div.QAItem-wrapper'));
  //   });
  //   await context.extract(productReviews, { transform });
  // },

};
