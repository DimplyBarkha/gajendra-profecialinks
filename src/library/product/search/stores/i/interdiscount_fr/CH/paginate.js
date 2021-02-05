
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount_fr',
    // nextLinkSelector: 'li.l-Be8I a._3XbJWN div._1Meu-e',
    // nextLinkSelector: 'li[class="l-Be8I"]:last-child a._3XbJWN div',
    // nextLinkSelector: 'li[class="l-Be8I"]:last-child a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div._3oe9VX',
    noResultsXPath: '//h1[@class="uIyEJC _35UgO3 _1EbEh9"][contains(.,"n’a donné aucun résultat.")]',
    openSearchDefinition: {
      template: 'https://www.interdiscount.ch/fr/search?search={searchTerms}&page={page}',
    },
    domain: 'interdiscount.ch',
    zipcode: '',
  },
};
