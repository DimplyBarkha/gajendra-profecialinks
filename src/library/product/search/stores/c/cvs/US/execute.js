
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
    url: 'https://www.cvs.com/shop-assets/proxy/search?query={searchTerms}&skip=0&pageSize=100&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D',
    loadedSelector: '',
    noResultsXPath: '//pre[contains(.,\'"totalRecordCount":0\')]',
  },
};