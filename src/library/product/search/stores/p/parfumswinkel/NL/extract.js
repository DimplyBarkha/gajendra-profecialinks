  
const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'parfumswinkel',
    transform,
    domain: 'parfumswinkel.nl',
    zipcode: "''",
  },
};
