
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    domain: 'arco.uk',
    url: 'https://www.arco.co.uk/search?event=search&Ntt={searchTerms}&Nrpp=36',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,searchTerms)]/span[contains(text(),"Sorry, your search for ")]',
    zipcode: '',  
  },
};
