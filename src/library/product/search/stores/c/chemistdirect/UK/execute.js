
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'chemistdirect',
    domain: 'chemistdirect.co.uk',
    url: 'https://www.chemistdirect.co.uk/search/go?w={searchTerms}',
    loadedSelector: 'div#cd-main',
    noResultsXPath: "//div[@id='nxt-nrf']",
    zipcode: '',
  },
};
