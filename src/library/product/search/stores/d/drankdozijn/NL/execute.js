module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'drankdozijn',
    domain: 'drankdozijn.nl',
    url: 'https://drankdozijn.nl/zoeken?zoekterm={searchTerms}',
    loadedSelector: '.row',
    noResultsXPath: '//ul[@class="zoeken_suggesties"]',
    zipcode: '',
  },
};
