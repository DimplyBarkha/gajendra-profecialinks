
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    domain: 'kastner-oehler.at',
    url: 'https://www.kastner-oehler.at/shop-suche/suche-%22{searchTerms}%22/',
    loadedSelector: 'div.site_inner',
    noResultsXPath: '//div[@class="en_grid"]//h3[contains(text(),"Keine Treffer!")]',
    zipcode: '',
  },
};
