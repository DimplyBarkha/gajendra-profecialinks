
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'farmaline_nl',
    domain: 'farmaline.be',
    url: 'https://www.farmaline.be/apotheek/zoeken/{searchTerms}',
    loadedSelector: 'ul#articleList',
    noResultsXPath: '//strong[contains(text(),"Geen producten gevonden.")]',
    zipcode: '',
  },
};
