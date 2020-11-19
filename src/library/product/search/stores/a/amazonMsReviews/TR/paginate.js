
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'amazon',
    nextLinkSelector: 'ul.a-pagination li.a-last:not(.a-disabled) a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    noResultsXPath: '//span[contains(text(),"sonuç yok")]',
    openSearchDefinition: {
      template: 'https://www.amazon.com.tr/s?k={searchTerms}&page={page}',
    },
    domain: 'amazon.com.tr',
    zipcode: '',
  },
};
