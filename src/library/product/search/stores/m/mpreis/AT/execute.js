
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    domain: 'shop.mpreis.at',
    url: 'https://shop.mpreis.at/index.php?lang=0&cl=search&searchparam={searchTerms}',
    loadedSelector: 'ul[id="searchList"]',
    noResultsXPath: '//div[contains(text(), "Leider keine Artikel gefunden.")]',
    zipcode: '',
  },
};
