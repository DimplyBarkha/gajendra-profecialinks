module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    domain: 'amazon.ca',
    // nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    // spinnerSelector: 'div.s-result-list-placeholder:not(.aok-hidden)',
    // Use openSearchDefinition if nextLink has navigation issues.
    stopConditionSelectorOrXpath: 'ul.a-pagination>li.a-last.a-disabled',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    openSearchDefinition: {
      template: 'https://www.amazon.ca/s?k={searchTerms}&ref=nb_sb_noss_2&page={page}',
    },
    noResultsXPath: '//div[contains(@class, "s-result-list")]/div[@data-asin]/span[contains(@class,"no-results")]'
  },
};
