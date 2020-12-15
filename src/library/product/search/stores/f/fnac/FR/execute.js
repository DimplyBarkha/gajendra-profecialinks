
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'fnac',
    domain: 'fnac.fr',
    url: 'https://www.fnac.com/SearchResult/ResultList.aspx?PageIndex=2&Search={searchTerms}&sft=1&sl',
    loadedSelector: 'article[class*="Article-itemGroup"]',
    noResultsXPath: '//div[contains(@class, "noResults")]',
    zipcode: "''",
  },
};
