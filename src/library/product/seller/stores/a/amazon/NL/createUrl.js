
module.exports = {
  implements: 'product/seller/createUrl',
  parameterValues: {
    domain: 'amazon.nl',
    prefix: null,
    sellerUrl: 'https://www.amazon.nl/sp?seller={id}',
    country: 'NL',
    store: 'amazon',
    zipcode: '',
  },
};
