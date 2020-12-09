const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function getMissingData ([{ text: id }]) {
    const obj = {};
    const product = await context.evaluate(async function (givenId) {
      const response = await fetch(`https://restql-server-api-v2-submarino.b2w.io/run-query/catalogo/product-without-promotion/20?c_opn=&id=${givenId}&offerLimit=1`);
      const data = await response.json();
      data.product.result.searchUrl = window.location.href;
      return data.product.result;
    }, id);
    obj.searchUrl = product.searchUrl;
    if (product.images && product.images.length !== 0) {
      obj.thumbnail = product.images[0].big;
    }
    if ('rating' in product) {
      obj.aggregateRating2 = String(product.rating.average).replace('.', ',');
      obj.reviewCount = product.rating.reviews;
    }
    return obj;
  };
  // extractor fails to properly load thumbnails and rating data thats why we fetch this data post extraction
  const dataRef = await context.extract(productDetails, { transform });
  for (const { group } of dataRef) {
    for (const row of group) {
      if (row.id) {
        const dataObj = await getMissingData(row.id);
        if (dataObj.thumbnail) {
          row.thumbnail = [{ text: dataObj.thumbnail }];
        }
        if (dataObj.aggregateRating2) {
          row.aggregateRating2 = [{ text: dataObj.aggregateRating2 }];
        }
        if (dataObj.reviewCount) {
          row.reviewCount = [{ text: dataObj.reviewCount }];
          row.ratingCount = [{ text: dataObj.reviewCount }];
        }
        row.searchUrl = [{ text: dataObj.searchUrl }];
      }
    }
  }
  return dataRef;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    transform: transform,
    domain: 'submarino.com.br',
    zipcode: '',
  },
  implementation,
};
