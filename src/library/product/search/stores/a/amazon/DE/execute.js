
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    domain: 'amazon.de',
    url: 'https://www.amazon.de/s?k={searchTerms}&__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss',
    loadedSelector: 'span[data-component-type="s-search-results"] div.s-main-slot',
    noResultsXPath: null,
    zipcode: "''",
  },
};
