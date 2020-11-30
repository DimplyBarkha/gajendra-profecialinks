
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'did',
    domain: 'did.ie',
    url: 'https://www.did.ie/catalogsearch/result/where/limit/all/q/{searchTerms}',
    loadedSelector: 'div#catalog-listing',
    noResultsXPath: '//p[@class="note-msg"]',
    zipcode: '',
  },
};
