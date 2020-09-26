const { transform } = require('./transform')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    transform: transform,
    domain: 'magasin.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    await context.waitForSelector('product-details', { timeout: 5000 });

    await context.evaluate(async function () {
      const productInfo = preFetchProductDetails();
      addEleToDoc('tempSkuId', productInfo['sku']);

      function preFetchProductDetails() {
        let productInfo = findProductDetails('//script[@type="application/ld+json" and contains(text(),"sku")]');
        productInfo = JSON.parse(productInfo.textContent);
        return productInfo;
      }

      function findProductDetails(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const productDetails = element;
        return productDetails;
      }

      function addEleToDoc(key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
