const { transform } = require('../../bigbasket/shared');
const { implementation } = require('../../bigbasket/IN/extract');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'bigbasketMweb',
    transform,
    domain: 'bigbasket.com',
  },implementation
};
