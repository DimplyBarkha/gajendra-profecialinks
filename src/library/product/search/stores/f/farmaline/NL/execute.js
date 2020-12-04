
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'farmaline',
    domain: 'farmaline.nl',
    url: 'https://www.farmaline.nl/drogisterij/zoeken/{searchTerms}',
    loadedSelector: 'ul.productlist.clearfix',
    noResultsXPath: '//div[@data-reactroot]/div[contains(.,"Geen producten gevonden")]',
    zipcode: '',
  },
};
