
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    domain: 'electronic4you.at',
    url: 'https://www.electronic4you.at/catalogsearch/result/?q="{searchTerms}"',
    loadedSelector: 'html body',
    noResultsXPath: '//p[@class="note-msg"]',
    zipcode: '',
  },
};
