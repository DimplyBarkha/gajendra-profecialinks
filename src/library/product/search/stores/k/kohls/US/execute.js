
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    domain: 'kohls.com',
    url: 'https://www.kohls.com/search.jsp?submit-search=web-regular&search="{searchTerms}"',
    loadedSelector: 'ul.products',
    noResultsXPath: '//div[@class="frame_no_results"]|//div[@class="pdp-content"]',
    zipcode: '',
  },
};
