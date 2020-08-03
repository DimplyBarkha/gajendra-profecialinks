
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsReviews',
    domain: 'amazon.es',
    url: 'https://www.amazon.es/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '//div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "404")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")]',
    zipcode: '',
  },
};
