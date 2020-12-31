
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    url: 'https://www.amazon.fr/s?k={searchTerms}&__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss',
    loadedSelector: 'span[data-component-type="s-search-results"] div.s-main-slot',
    noResultsXPath: null,
    zipcode: "''",
  },
};
