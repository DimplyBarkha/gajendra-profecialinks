const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'Chronodrive',
    transform,
    domain: 'chronodrive.com',
    zipcode: '91160',
  },
};
