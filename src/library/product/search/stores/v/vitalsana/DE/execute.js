
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'vitalsana',
    domain: 'vitalsana.com',
    url: 'https://www.vitalsana.com/catalogsearch/result/?q={searchTerms}',
    loadedSelector: '#maincontent',
    noResultsXPath: "//div[@class='message notice']/div",
    zipcode: '',
  },
};
