
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    openSearchDefinition: {
      template: 'https://www.sephora.com/ca/en/api/catalog/search?type=keyword&q={searchTerms}&content=true&includeRegionsMap=true&page=50&currentPage={page}',
    },
    domain: 'sephora.com',
  },
};
