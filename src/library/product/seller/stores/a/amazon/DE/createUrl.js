
module.exports = {
  implements: 'product/seller/createUrl',
  parameterValues: {
    domain: 'amazon.de',
    prefix: null,
    sellerUrl: 'https://www.amazon.de/sp?seller={id}',
    country: 'DE',
    store: 'amazon',
    zipcode: '',
  },
};
