module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    domain: 'waitrose.com',
    loadedSelector: 'section[class="productDetailContainer___1TUHx"], a[data-origincomponent="ProductPod"]',
    noResultsXPath: '//button[@aria-label="Load more"] | //div[@class="noResults___2M4HP"] | //h1[contains(text(), "404 Not Found")] | //ul[@style="margin-left:1.3em;margin-bottom:2em"] | //h1[contains(text(), "Offer(s)")] | //pdf-viewer | //span[contains(text(), "Cadenza Document")]',
    zipcode: '',
  },
};
