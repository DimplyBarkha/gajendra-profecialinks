
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'amazon',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.s-result-list-placeholder:not(.aok-hidden)',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.amazon.com.br/s?k={searchTerms}&ref=nb_sb_noss_2&dc&page={page}',
    },
    domain: 'amazon.com.br',
    zipcode: null,
  },
};
