
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'tesco.com',
    prefix: 'groceries/en-GB/products',
    country: 'UK',
    store: 'tesco',
    url: 'https://www.tesco.com/groceries/products/{id}'
  },
};
