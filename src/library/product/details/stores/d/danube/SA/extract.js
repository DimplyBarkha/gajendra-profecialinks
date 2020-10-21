const {transform} = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SA',
    store: 'danube',
    transform,
    domain: 'danube.sa',
    zipcode: '',
  },
};
