
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    domain: 'expert.de',
    url: 'https://www.expert.de/suche?q={searchTerms}',
    loadedSelector: 'div.widget-ArticlePPM ',
    noResultsXPath: '//img[contains(@alt, "Keine Suchergebnisse")]',
    zipcode: '',
  },
};
