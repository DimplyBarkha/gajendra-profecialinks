module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    domain: 'cvs.com',
    store: 'cvs',
    loadedSelector: '',
    openSearchDefinition: {
      template: 'https://www.cvs.com/shop-assets/proxy/search?query={searchTerms}&skip={page}&pageSize=100&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D',
    },
  },
};