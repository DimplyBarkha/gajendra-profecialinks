const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'hair-gallery',
    transform,
    domain: 'hair-gallery.it',
    zipcode: '',
  },
};
