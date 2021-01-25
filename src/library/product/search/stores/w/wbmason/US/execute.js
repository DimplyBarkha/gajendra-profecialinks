
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'wbmason',
    domain: 'wbmason.com',
    url: "https://www.wbmason.com/SearchResults.aspx?Keyword={searchTerms}&sc=BM&fi=1&fr=1",
    loadedSelector: 'div.search-rightcol div#ctl00_ContentPlaceholder1_ProductList_pnlProductsGrid div.grid-row div',
    noResultsXPath: '//span[@id="ctl00_ContentPlaceholder1_NoResultsUC_NoResultsText"]',
    zipcode: '',
  },
};
