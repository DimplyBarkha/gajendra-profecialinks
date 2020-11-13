
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    domain: 'freshamazon.de',
    url: 'https://www.amazon.de/s?k={searchTerms}&__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
