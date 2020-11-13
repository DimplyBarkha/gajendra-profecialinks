
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    domain: 'groceries.morrisons.com',
    loadedSelector: 'section#productInformation',
    noResultsXPath: '//div[@class="bop-outOfStock"]|//p[@class="nf-resourceNotFound__heading"]|//section[@class="bop-section bop-basicInfo bop-outOfStock__section"]',
    zipcode: '',
  },
};
