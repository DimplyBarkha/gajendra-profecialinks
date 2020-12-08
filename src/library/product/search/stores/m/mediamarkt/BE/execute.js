
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    domain: 'mediamarkt.be',
    url: 'https://www.mediamarkt.be/nl/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmbenl',
    loadedSelector: 'div.product-wrapper',
    noResultsXPath: '//div[@class="no_search_result_text"]|//div[@data-cms-id="product_detail-top"]|//meta[@data-id="emptysearchresult"]|//div[@data-cms-id="emptysearchresult-bottom"]|//figure[contains(@class, "brand-image")]',
    zipcode: '',
  },
};
