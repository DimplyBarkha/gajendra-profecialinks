
module.exports = {
  implements: 'product/seller/createUrl',
  parameterValues: {
    domain: 'amazon.co.uk',
    prefix: null,
    sellerUrl: 'https://www.amazon.co.uk/sp?seller={id}',
    country: 'UK',
    store: 'amazon',
    zipcode: '',
  },
};
