
module.exports = {
  implements: 'product/seller/createUrl',
  parameterValues: {
    domain: 'amazon.fr',
    prefix: null,
    sellerUrl: 'https://www.amazon.fr/sp?seller={id}',
    country: 'FR',
    store: 'amazon',
    zipcode: '',
  },
};
