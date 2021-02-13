
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    domain: 'otto.de',
    url: 'https://www.otto.de/suche/{searchTerms}/?l=gq&o=0',
    loadedSelector: 'div[id="san_searchResult"]',
    //loadedSelector: 'div[class="content contentWithSidebar"]',
    noResultsXPath: null,
    zipcode: '',
  },
};