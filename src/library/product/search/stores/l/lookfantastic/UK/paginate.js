module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    loadedSelector: "li[class*='productListProducts_product'] , div.noresults",
    domain: 'lookfantastic.com',
    openSearchDefinition: {
      template: 'https://www.lookfantastic.com/elysium.search?search={searchTerms}&pageNumber={page}',
    },
  },
};
