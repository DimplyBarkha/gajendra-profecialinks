
module.exports = {
  implements: 'product/seller/createUrl',
  parameterValues: {
    domain: 'amazon.it',
    prefix: null,
    sellerUrl: 'https://www.amazon.it/sp?seller={id}',
    country: 'IT',
    store: 'amazon',
    zipcode: '',
  },
};
