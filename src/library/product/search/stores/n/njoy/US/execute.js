
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    domain: 'shop.njoy.com',
    url: 'https://shop.njoy.com/search.php?search_query={searchTerms}&section=product',
    loadedSelector: 'div[data-review-id]:not(.yotpo-hidden),a[class="button confirmm-age"]',
    noResultsXPath: '//h2[contains(text(),"0 Results Available")]',
    zipcode: '',
  },
};
