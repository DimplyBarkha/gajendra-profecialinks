
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    domain: 'ao.de',
    url: "https://www.ao.de/l/suche/101/99/?suche='{searchTerms}'",
    loadedSelector: 'div#body,main.lister',
    noResultsXPath: '//div[@class="no-results "]',
    zipcode: '',
  },
};
