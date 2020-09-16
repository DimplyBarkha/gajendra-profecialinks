
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'costco.com',
    prefix: null,
    url: 'https://www.costco.com/.product.{id}.html',
    country: 'US',
    store: 'costco',
    zipcode: '94209',
  },
};
