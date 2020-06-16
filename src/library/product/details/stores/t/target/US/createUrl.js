module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'target.com',
    prefix: null,
    country: 'US',
    store: 'target',
    url: 'https://www.target.com/s?searchTerm={id}',
  },
};
