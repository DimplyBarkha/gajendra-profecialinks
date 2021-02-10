
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    domain: 'booker.co.uk',
    url: 'https://www.booker.co.uk/products/product-list?categoryName=&keywords={searchTerms}&view=UnGrouped&sortField=SearchRelevancy&SortDirection=Ascending&multi=False&pageIndex=0',
    loadedSelector: 'main.inner-list',
    noResultsXPath: '//p[contains(text(),"search returned no results")] | //h1[contains(text(),"The website is undergoing essential maintenance")] | //h1[contains(text(),"Sorry, this page does not exist")]|//*[contains(text(),"Sorry, your search returned no results")]',
  },
};
