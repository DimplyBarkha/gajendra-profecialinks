
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    domain: 'sainsburys.co.uk',
    url: 'https://www.sainsburys.co.uk/shop/CatalogSearchResultView?listId=&catalogId=10070&searchTerm={searchTerms}&beginIndex=0&pageSize=90&orderBy=RELEVANCE&top_category=&langId=44&storeId=10151&categoryId=&promotionId=&parent_category_rn=',
    // loadedSelector: 'section[class="ln-o-section ln-o-section"] ul[class="ln-o-grid ln-o-grid--matrix ln-o-grid--equal-height"] li[class="pt-grid-item ln-o-grid__item ln-u-6/12@xs ln-u-3/12@md ln-u-2/12@xl"]',
    noResultsXPath: '(//div[contains(@class,"si__no-results")])[1]',
    zipcode: '',
  },
};



