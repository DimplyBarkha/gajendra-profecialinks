const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'madcoop',
    transform,
    domain: 'butik.mad.coop.dk',
    zipcode: '',
  },
 
};