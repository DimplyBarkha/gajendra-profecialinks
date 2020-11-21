const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'sightful',
    transform,
    domain: 'sightful.nl',
    zipcode: '',
  },
};
