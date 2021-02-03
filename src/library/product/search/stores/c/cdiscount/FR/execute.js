
module.exports = {
  implements: 'product/search/stores/c/cdiscount/execute',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    domain: 'cdiscount.fr',
    url: 'https://www.cdiscount.com/search/10/{searchTerms}.html',
    zipcode: "''",
  },
};
