const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    transform,
    domain: 'misterspex.de',
    zipcode: "''",
  }
