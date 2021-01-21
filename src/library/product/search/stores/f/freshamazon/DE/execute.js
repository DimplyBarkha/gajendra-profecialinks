
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    domain: 'freshamazon.de',
    url: 'https://www.amazon.de/s/ref=nb_sb_noss?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Damazonfresh&field-keywords={searchTerms}',
    loadedSelector: 'div[class="s-main-slot s-result-list s-search-results sg-row"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
