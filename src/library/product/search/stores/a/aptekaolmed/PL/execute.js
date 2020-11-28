
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    domain: 'aptekaolmed.pl',
    url: 'https://www.aptekaolmed.pl/search.php?text={searchTerms}',
    // url: 'https://www.aptekaolmed.pl/search.php?text=pieluchomajtki',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
