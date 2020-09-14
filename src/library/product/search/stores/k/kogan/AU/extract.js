//const { transform } = require('../../../../shared');
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    transform,
    domain: 'kogan.com',
    zipcode: '',
  },    
};
