
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'farmaline',
    domain: 'farmaline.be',
    url: 'https://www.farmaline.be/apotheek/zoeken/{searchTerms}',
    loadedSelector: 'ul.productlist.clearfix',
    noResultsXPath: '//div[@data-reactroot]/div[contains(.,"Geen producten gevonden")]',
    zipcode: '',
  },
};
