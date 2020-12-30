
module.exports = {
  implements: 'product/seller/createUrl',
  parameterValues: {
    domain: 'amazon.ca',
    prefix: null,
    sellerUrl: 'https://www.amazon.ca/sp?seller={id}',
    country: 'CA',
    store: 'amazon',
    zipcode: '',
  },
};
