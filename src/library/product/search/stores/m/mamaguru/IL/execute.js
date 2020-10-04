
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'mamaguru',
    domain: 'mamaguru.co.il',
    url: 'https://www.mamaguru.co.il/SearchResults.aspx?Q={searchTerms}',
    loadedSelector: 'article.ItemsStripWrap',
    noResultsXPath: null,
  },
};
