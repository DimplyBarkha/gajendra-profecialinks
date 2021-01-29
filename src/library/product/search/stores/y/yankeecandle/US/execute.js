
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'yankeecandle',
    domain: 'yankeecandle.com',
    // url: 'https://www.yankeecandle.com/search?Ntt={searchTerms}',
    url:'https://www.yankeecandle.com/search?Ntt={searchTerms}&Ns=sku.stockLevel|1||DefaultSort|1||sku.bestSeller|1||sku.new|1||sku.ranking|0||product.heilerParentProdNbr|0&&No=0&Nrpp=150',
    // url: 'https://www.yankeecandle.com/search?Ntt=baby+bottles&Ns=sku.stockLevel|1||DefaultSort|1||sku.bestSeller|1||sku.new|1||sku.ranking|0||product.heilerParentProdNbr|0&No=0&Nrpp=24',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
