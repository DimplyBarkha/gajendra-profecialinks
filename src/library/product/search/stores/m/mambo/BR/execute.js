module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'mambo',
    domain: 'mambo.com.br',
    url: 'https://www.mambo.com.br/searchresults?Ntt={searchTerms}&Nty=1&No=0&Nrpp=12&Rdm=294&searchType=simple&type=search',
    loadedSelector: '.CC-shelf',
    noResultsXPath: null,
    zipcode: '',
  },
};
