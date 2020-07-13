
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    domain: 'amazon.ca',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul.a-pagination li.a-last:not(.a-disabled) a',
    mutationSelector: 'span[cel_widget_id="UPPER-RESULT_INFO_BAR"] div>span[dir="auto"]:first-of-type',
    spinnerSelector: 'div.s-result-list-placeholder:not([class*="hidden"])',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    zipcode: '',
  },
};
