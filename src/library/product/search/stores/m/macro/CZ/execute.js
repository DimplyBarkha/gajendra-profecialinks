
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CZ',
    store: 'macro',
    domain: 'macro.cz',
    url: 'https://sortiment.makro.cz/cs/search/?submitted=1&lst=catalog&q={searchTerms}',
    loadedSelector: 'main[class^="mo-container"]',
    noResultsXPath: '//span[@class="alert-description" and text()="Hledaným parametrům nevyhovuje žádné zboží. "]',
    zipcode: '',
  },
};
