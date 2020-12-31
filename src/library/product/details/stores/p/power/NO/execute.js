
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'power',
    domain: 'power.no',
    loadedSelector: 'section#product-intro',
    noResultsXPath: '//section[@class="error-404"] | //span[@class="total-qty"][normalize-space(text()) = "0"] | //div[contains(@class, "frontpage")]',
    zipcode: '',
  },
};
