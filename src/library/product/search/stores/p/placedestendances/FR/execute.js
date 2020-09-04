
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'placedestendances',
    domain: 'placedestendances.com',
    url: 'https://www.placedestendances.com/fr/fr/{searchTerms}',
    loadedSelector: 'div.lien_voir_tout_container',
    noResultsXPath: '//div[@class="titrefindeco" and contains(text(),"Oups")]',
    zipcode: '',
  },
};
