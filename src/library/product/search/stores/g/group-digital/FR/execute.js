
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'group-digital',
    domain: 'group-digital.fr',
    url: 'https://www.group-digital.fr/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div[class="category-products"] > ul',
    noResultsXPath: '//p[@class="note-msg"]',
    zipcode: '',
  },
};
