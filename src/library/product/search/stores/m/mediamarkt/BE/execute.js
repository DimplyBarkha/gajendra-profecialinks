
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    domain: 'mediamarkt.be',
    url: 'https://www.mediamarkt.be/nl/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmbenl',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '((//div[@class="no_search_result_text"])[1]|//div[@data-cms-id="product_detail-top"])[1]',
    zipcode: '',
  },
};
