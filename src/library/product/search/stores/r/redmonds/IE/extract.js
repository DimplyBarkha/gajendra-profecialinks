const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'redmonds',
    transform: transform,
    domain: 'redmondelectric.ie',
    zipcode: '',
  },
};
