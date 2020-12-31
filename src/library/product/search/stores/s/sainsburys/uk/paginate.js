
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    // nextLinkSelector: 'li[class="ln-c-pagination__item ln-c-pagination__item--next"]',
    // nextLinkSelector: 'li[class="ln-c-pagination__item ln-c-pagination__item--next"] > a:not(.is-disabled)',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'section[class="ln-o-section ln-o-section"] ul[class="ln-o-grid ln-o-grid--matrix ln-o-grid--equal-height"] li[class="pt-grid-item ln-o-grid__item ln-u-6/12@xs ln-u-3/12@md ln-u-2/12@xl"]',
    openSearchDefinition: {
      pageStartNb: 0,
      pageIndexMultiplier:90,
      template: 'https://www.sainsburys.co.uk/shop/CatalogSearchResultView?listId=&catalogId=10070&searchTerm={searchTerms}&beginIndex={index}&pageSize=90&orderBy=RELEVANCE&top_category=&langId=44&storeId=10151&categoryId=&promotionId=&parent_category_rn=',
    },
    domain: 'sainsburys.co.uk',
    noResultsXPath: '(//div[contains(@class,"si__no-results")])[1]',
    zipcode: '',
  },
};
