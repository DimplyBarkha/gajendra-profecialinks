//const {transform} = require('../US/format');
const {transform} = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform,
    domain: 'samsclub.com',
    zipcode: '',
  },
};
