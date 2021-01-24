
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount_fr',
    domain: 'interdiscount.ch',
    url: 'https://www.interdiscount.ch/fr/search?search={searchTerms}',
    loadedSelector: 'section .ulvVbt > div:nth-last-child(2) img',
    noResultsXPath: '//h1[@class="uIyEJC _35UgO3 _1EbEh9"][contains(.,"n’a donné aucun résultat.")]',
    zipcode: '',
  },
};
