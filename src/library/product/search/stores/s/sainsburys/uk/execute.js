
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    domain: 'sainsburys.co.uk',
    url: 'https://www.sainsburys.co.uk/shop/CatalogSearchResultView?listId=&catalogId=10070&searchTerm={searchTerms}&beginIndex=0&pageSize=90&orderBy=RELEVANCE&top_category=&langId=44&storeId=10151&categoryId=&promotionId=&parent_category_rn=',
    loadedSelector: 'ul[class="productLister gridView"]',
    noResultsXPath: '(//div[contains(@class,"si__no-results")])[1]',
    zipcode: '',
  },
};



