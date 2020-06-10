
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    prefix: 'dp',
    country: 'US',
    store: 'amazon',
    url: 'https://amazon.com/dp/{id}',
  },
};
