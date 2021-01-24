
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount_fr',
    // nextLinkSelector: 'li[class="l-Be8I"]:last-child a._3XbJWN div',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div._3oe9VX',
    noResultsXPath: '//h1[@class="uIyEJC _35UgO3 _1EbEh9"][contains(.,"n’a donné aucun résultat.")]',
    openSearchDefinition: {
      template: '//www.interdiscount.ch/fr/search?search={searchTerms}&page={page}',
    },
    domain: 'interdiscount.ch',
    zipcode: '',
  },
};
