
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'placedestendances',
    domain: 'placedestendances.com',
    url: 'https://www.placedestendances.com/fr/fr/recherche?query={searchTerms}',
    loadedSelector: 'div#viewallMain',
    noResultsXPath: '//div[@class="titrefindeco" and contains(text(),"Oups")]',
    zipcode: '',
  },
};
