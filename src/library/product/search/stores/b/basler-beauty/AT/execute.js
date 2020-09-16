
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'basler-beauty',
    domain: 'basler-beauty.at',
    url: 'https://www.basler-beauty.at/index.php?cl=search&searchparam={searchTerms}',
    loadedSelector: 'div.list-container',
    noResultsXPath: '//*[contains(@class,"dd-shortcode-image")]//img/@src',
    zipcode: '',
  },
};
