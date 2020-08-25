
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    domain: 'amazon.com',
    loadedSelector: 'span[data-component-type="s-product-image"]',
    noResultsXPath: '//span[contains(@class, "messaging-messages-no-results")]',
    // loadedSelector: '#productTitle',
    // noResultsXPath: '//div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "404")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")] | //img[contains(@alt,"Sorry! Something went wrong on our end. ")] | //div[@id="g"]//img[contains(@alt,"Dogs")]',
  },
};
