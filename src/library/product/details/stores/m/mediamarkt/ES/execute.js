
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    domain: 'mediamarkt.es',
    // loadedSelector: '.preview img',
    // loadedSelector: '.ProductDetailPagestyled__StyledPdpWrapper-sc-5s3nfq-1',
    loadedSelector: 'div[class*="ProductDetailPagestyled"]',
    // noResultsXPath: '//div[@id="search_no_result-bottom_right"]',
    noResultsXPath: '//div[contains(@class,"ZeroResultsView")]',
    zipcode: '',
  },
};
