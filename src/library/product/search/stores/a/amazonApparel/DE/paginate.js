
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparel',
    domain: 'amazon.de',
    nextLinkSelector: 'ul.a-pagination > li.a-last a',
    mutationSelector: 'span[cel_widget_id="UPPER-RESULT_INFO_BAR"] div>span[dir="auto"]:first-of-type',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    spinnerSelector: 'div.s-result-list-placeholder:not([class*="hidden"])',
  },
};
