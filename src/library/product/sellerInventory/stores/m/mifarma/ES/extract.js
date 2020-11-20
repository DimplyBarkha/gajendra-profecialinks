const { transform } = require('../../../../shared');
const { getStockFunc } = require('./stockExtract');

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    transform,
    getStockFunc,
    domain: 'mifarma.es',
    loadedSelector: null,
    zipcode: '',
  },
};
