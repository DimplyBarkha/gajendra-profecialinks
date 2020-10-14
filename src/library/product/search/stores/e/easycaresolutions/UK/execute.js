
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'easycaresolutions',
    domain: 'easycaresolutions.co.uk',
    url: 'https://www.easycaresolutions.co.uk/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'ol[class*="product-items"]',
    noResultsXPath: '//div[@class="no-result" and not(contains(@style, "display: none;"))]',
    zipcode: '',
  },
};
