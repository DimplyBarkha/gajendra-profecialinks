
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    domain: 'arco.uk',
    url: `https://www.arco.co.uk/search?event=search&Ntt={searchTerms}&Nrpp=36`,
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',  
  },
};
