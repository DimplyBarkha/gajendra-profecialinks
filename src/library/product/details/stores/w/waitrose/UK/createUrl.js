
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'waitrose.com',
    prefix: null,
    country: 'UK',
    store: 'waitrose',
    url: 'https://www.google.com/search?q=site:/www.waitrose.com%20{id}',
    zipcode: '',
  },
};
