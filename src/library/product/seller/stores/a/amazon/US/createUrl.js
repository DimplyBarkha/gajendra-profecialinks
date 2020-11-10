
module.exports = {
  implements: 'product/seller/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    prefix: null,
    sellerUrl: 'https://www.amazon.com/sp?seller={id}',
    country: 'US',
    store: 'amazon',
    zipcode: '',
  },
};
