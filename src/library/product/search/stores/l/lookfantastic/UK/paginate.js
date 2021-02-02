module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
  country: 'UK',
  store: 'lookfantastic',
  loadedSelector: "ul.productListProducts_products li",
  domain: 'lookfantastic.com',
  openSearchDefinition: {
  template: 'https://www.lookfantastic.com/elysium.search?search={searchTerms}&pageNumber={page}',
  },
  },
  };