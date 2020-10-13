
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'EG',
    store: 'jumia',
    domain: 'jumia.com.eg',
    url: "https://www.jumia.com.eg/catalog/?q={searchTerms}",
    loadedSelector: null,
    noResultsXPath: '//h2[contains(text(), "There are no results for")]',
    zipcode: '',
  },
};
