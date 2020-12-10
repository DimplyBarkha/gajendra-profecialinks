
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'dischem',
    domain: 'dischem.co.za',
    url: 'https://www.dischem.co.za/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.products-grid ol li:first-child img',
    noResultsXPath: "//div[@class='search results']//div[@class='message info empty']",
    zipcode: '',
  },
};
