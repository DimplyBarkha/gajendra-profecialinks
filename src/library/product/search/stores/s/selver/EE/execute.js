
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'EE',
    store: 'selver',
    domain: 'selver.ee',
    url: 'https://www.selver.ee/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'ol[id="products-grid"] li',
    noResultsXPath: '//p[@class="note-msg"]',
    zipcode: '',
  },
};
