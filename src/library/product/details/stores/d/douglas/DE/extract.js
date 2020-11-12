
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    transform: null,
    domain: 'douglas.de',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const productData = JSON.parse(findProductDetails('//span[contains(@id,"webtrekk")]/preceding-sibling::script[1]'));
      addEleToDoc('gtin13', productData.gtin13);
      addEleToDoc('ratingCount', productData.aggregateRating.ratingCount);
      addEleToDoc('ratingValue', productData.aggregateRating.ratingValue);

      // Output value is expected either InStock or Out of Stock but on webpage, its in german
      const availability = getEleByXpath('//div[contains(@class,"rd__product-details__options__availability")]/span[contains(@class,\'rd__copytext\')][1]');
      const outOfStock = 'Leider ausverkauft';
      const inStock = 'Auf Lager';
      if (availability === outOfStock) {
        addEleToDoc('availability', 'Out of stock');
      } else if (availability === inStock) {
        addEleToDoc('availability', 'In stock');
      }
      const productInfo = preFetchProductDetails('window.customExactagConfig =');
      addEleToDoc('productId', productInfo.product_id);

      function preFetchProductDetails (referenceText) {
        let productInfo = findProductDetails('//script[contains(.,"customExactagConfig")]');
        productInfo = JSON.parse(productInfo.substring((productInfo.indexOf(referenceText) + referenceText.length), productInfo.indexOf('}') + 1));
        return productInfo;
      }

      function findProductDetails (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const productDetails = element.textContent;
        return productDetails;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }
    });
    return await context.extract(productDetails);
  },
};
