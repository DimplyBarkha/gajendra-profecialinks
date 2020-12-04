const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: '1800petmeds',
<<<<<<< HEAD
    transform,
=======
    transform: transform,
>>>>>>> a6a45fa11f5bf6be59c1b89b743e414effaaddde
    domain: '1800petmeds.com',
    zipcode: '',
  },
};
