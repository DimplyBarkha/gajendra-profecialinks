
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'boots.com',
    url: 'https://www.boots.com/sitesearch?searchTerm={id}',
    country: 'UK',
    store: 'boots',
    zipcode: '',
  },
};
