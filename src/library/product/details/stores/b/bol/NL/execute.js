
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    domain: 'bol.com',
    loadedSelector: 'div[class="[ fluid-grid  fluid-grid--rwd--l ]  new_productpage"',
    noResultsXPath: '//div[@data-test="non-deliverable"]',
    zipcode: '',
  },
};
