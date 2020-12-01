
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'HU',
    store: 'spar',
    domain: 'spar.hu',
    url: 'https://www.spar.hu/kereses?q={searchTerms}&category=products',
    loadedSelector: 'img.tile-basic__image.tile-basic__image--product',
    noResultsXPath: null,
    zipcode: '',
  },
};
