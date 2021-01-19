const { transform } = require('./format');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'juul',
    transform: transform ,
    domain: 'juul.co.uk',
    zipcode: '',
  },
};
