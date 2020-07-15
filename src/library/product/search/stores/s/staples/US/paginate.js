
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'staples',
    loadedSelector: "body > pre[style='word-wrap: break-word; white-space: pre-wrap;']",
    noResultsXPath: null,
    openSearchDefinition: {
      page: 1,
      template: 'https://www.staples.com/searchux/api/v1/searchProxy?term={searchTerms}&pn={page}&ajaxRequest=true&deviceType=desktop&autoFilter=false',
    },
    domain: 'staples.com',
    zipcode: '',
  },
};
