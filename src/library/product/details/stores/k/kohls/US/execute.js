
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    domain: 'kohls.com',
    loadedSelector: 'div[id="PDP_colGrid"],div[id="CDP_collection_product"]',
    noResultsXPath: '//div[@class="pdp_outofstockproduct"]|//div[@class="frame_no_results"]|//div[@class="errorpage"]/h1[contains(.,"no longer exist")]|//div[@class="pmpSearch_container"]',
    zipcode: '',
  },
};
