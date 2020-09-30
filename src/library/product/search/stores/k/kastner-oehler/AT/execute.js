
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    domain: 'kastner-oehler.at',
    url: 'www.kastner-oehler.at/index.php?searchparam={searchTerms}&lang=0&cl=search',
    loadedSelector: 'div.site_inner',
    noResultsXPath: '//div[@class="en_grid"]//h3[contains(text(),"Keine Treffer!")]',
    zipcode: '',
  },
};
