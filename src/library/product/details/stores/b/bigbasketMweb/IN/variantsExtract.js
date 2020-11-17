const { implementation } = require('../../bigbasket/IN/variantsExtract');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IN',
    store: 'bigbasketMweb',
    transform: null,
    domain: 'bigbasket.com',
  },implementation
};
