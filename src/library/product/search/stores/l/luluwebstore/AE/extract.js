const transform = require('../../../../shared');
// const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'luluwebstore',
    transform: transform,
    domain: 'luluhypermarket.com',
    zipcode: '',
  },

};