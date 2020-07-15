
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'staples',
    domain: 'staples.com',
    url: 'https://www.staples.com/searchux/api/v1/searchProxy?term={searchTerms}&ajaxRequest=true&deviceType=desktop&autoFilter=false',
    loadedSelector: "body > pre[style='word-wrap: break-word; white-space: pre-wrap;']",
    noResultsXPath: null,
    zipcode: '',
  },
};
