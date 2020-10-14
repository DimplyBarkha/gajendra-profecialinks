const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cdw',
    transform,
    domain: 'cdw.com',
    zipcode: '',
  },
};
