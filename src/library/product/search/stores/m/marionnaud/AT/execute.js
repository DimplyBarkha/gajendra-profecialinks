
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    domain: 'marionnaud.at',
    url: 'https://www.marionnaud.at/search?text={searchTerms}',
    loadedSelector: '',
    noResultsXPath: 'not(//div[@class="container-fluid"]/div[@class="more-data-loader"])',
    zipcode: '',
  },
};
