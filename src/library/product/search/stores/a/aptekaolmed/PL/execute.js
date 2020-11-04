
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    domain: 'aptekaolmed.pl',
    url: 'https://www.aptekaolmed.pl/search.php?text=tena+pants',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
