
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'costco.ca',
    prefix: null,
    url: 'https://www.costco.ca/.product.{id}.html',
    country: 'CA',
    store: 'costco',
    zipcode: '',
  },
};
