
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    domain: 'otto.de',
    url: 'https://www.otto.de/suche/{searchTerms}/', 
    loadedSelector: 'section[id="san_resultSection"] article',
    noResultsXPath: '//div[@class="san_error__site san_error__no-results"]',
  },
};
