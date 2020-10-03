const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    transform: cleanUp,
    domain: 'littlewoods.com',
    zipcode: '',
  },
};
