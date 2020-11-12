
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'amazonApparel',
    nextLinkSelector: 'ul.a-pagination > li.a-last a',
    mutationSelector: 'span[cel_widget_id="UPPER-RESULT_INFO_BAR"] div>span[dir="auto"]:first-of-type',
    spinnerSelector: 'div.s-result-list-placeholder:not([class*="hidden"])',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    domain: 'amazon.de',
  },
};
