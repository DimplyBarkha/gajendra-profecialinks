
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    nextLinkSelector: 'li[class="ln-c-pagination__item ln-c-pagination__item--next"]',
    // nextLinkSelector: 'li[class="ln-c-pagination__item ln-c-pagination__item--next"] > a:not(.is-disabled)',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'section[class="ln-o-section ln-o-section"] ul[class="ln-o-grid ln-o-grid--matrix ln-o-grid--equal-height"] li[class="pt-grid-item ln-o-grid__item ln-u-6/12@xs ln-u-3/12@md ln-u-2/12@xl"]',
    // openSearchDefinition: {
    //   template: 'https://www.sainsburys.co.uk/gol-ui/SearchDisplayView?filters[keyword]={searchTerms}&pageNumber={page}&pageSize=90',
    // },
    domain: 'sainsburys.co.uk',
    noResultsXPath: '(//div[contains(@class,"si__no-results")])[1]',
    zipcode: '',
  },
};
