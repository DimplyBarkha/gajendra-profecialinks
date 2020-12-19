const {transform}=require('../FR/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'canadiantire',
    transform,
    domain: 'canadiantire.ca/fr.html',
    zipcode: '',
  },
};
