const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'hair-gallery',
    transform,
    domain: 'hair-gallery.it',
    zipcode: "''",
  },
};
