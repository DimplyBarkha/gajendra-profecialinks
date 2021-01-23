
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount_fr',
    domain: 'interdiscount.ch',
    url: 'https://www.interdiscount.ch/fr/search?search={searchTerms}',
    loadedSelector: 'section .ulvVbt > div:nth-last-child(2) img',
    noResultsXPath: '//h1[contains(text(),"Votre recherche de")]',
    zipcode: '',
  },
};
