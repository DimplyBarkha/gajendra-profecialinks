const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PE',
    store: 'Juntoz_Enfabebe',
    transform: transform,
    domain: 'enfabebe.juntoz.com',
    zipcode: '',
  },
};
