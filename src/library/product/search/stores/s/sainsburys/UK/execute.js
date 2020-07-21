
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    domain: 'sainsburys.co.uk',
    url: 'https://www.sainsburys.co.uk/webapp/wcs/stores/servlet/CatalogSearchResultView?pageSize=90&searchTerm={searchTerms}&catalogId=10122&orderBy=RELEVANCE&top_category=&parent_category_rn=&listId=&categoryId=&langId=44&beginIndex=0&storeId=10151&promotionId=',
    loadedSelector: 'div#productsContainer ul.productLister',
    noResultsXPath: '//div[@id="content"]//h1[contains(text(),"There are no products on this shelf at the moment")] | //div[@id="content"]//p[contains(text(),"Sorry, we couldn\'t find any results")] | //div[@id="content"]//*[contains(text(),"We didn\'t find anything for")]',
  },
};
