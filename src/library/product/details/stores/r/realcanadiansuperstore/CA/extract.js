const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'realcanadiansuperstore',
    transform,
    domain: 'realcanadiansuperstore.ca',
    zipcode: '',
  },
};
