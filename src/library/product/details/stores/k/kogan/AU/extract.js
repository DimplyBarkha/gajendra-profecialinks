const { transform } =require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    transform,
    domain: 'kogan.com',
    zipcode: '',
  },
};
