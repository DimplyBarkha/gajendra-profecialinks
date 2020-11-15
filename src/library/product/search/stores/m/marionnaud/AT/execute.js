
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'marionnaud',
    domain: 'marionnaud.at',
    url: 'https://www.marionnaud.at/search?text={searchTerms}',
    loadedSelector: 'div.container-fluid>div.more-data-loader > div.container-fluid, container-fluid--max-width',
    noResultsXPath: 'not(//div[@class="container-fluid"]/div[@class="more-data-loader"])',
    zipcode: '',
  },
};
