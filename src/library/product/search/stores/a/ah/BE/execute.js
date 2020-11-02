
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    domain: 'ah.be',
    url: 'https://www.ah.be/zoeken?query=aardbeien',
    loadedSelector: '#search-lane>div>article',
    noResultsXPath: null,
    zipcode: '',
  },
};
