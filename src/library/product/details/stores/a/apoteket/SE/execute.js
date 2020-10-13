
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    domain: 'apoteket.se',
    loadedSelector: 'div[class="product-grid__items"]',
    noResultsXPath: '//div[@class="product-grid__loader"]',
    // loadedSelector: 'article.productpage',
    // noResultsXPath: '//div[contains(@class,"product-grid__loader") and text()="Inga produkter hittades"] | //article[contains(@class , "errorpage")]',
    zipcode: '',
  },
};
