const { transform } = require('../CA/format');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
<<<<<<< HEAD
    transform,
    domain: 'sephora.com',
=======
    transform: null,
    domain: 'sephora.ca',
>>>>>>> 40bb455cf92282cde21a2efe549ba0bc073c7b39
    zipcode: '',
  },
};
