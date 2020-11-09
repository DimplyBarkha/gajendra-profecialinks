
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes_lg',
    nextLinkSelector: 'li:last-child a.arrow',     
    loadedSelector: 'div[data-selector="splp-prd-lst-plpo"]',
    noResultsXPath: '//section[@id="main"]/div/h1',
    domain: 'lowes.com',
  },
};