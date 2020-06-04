
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    transform: null,
    domain: 'bestwaywholesale.co.uk',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const productData = findProductDetails();

      addEleToDoc('productId', productData.id);
      addEleToDoc('productName', productData.name);
      addEleToDoc('productPrice', productData.price);
      addEleToDoc('productCategory', productData.category);
      addEleToDoc('productVariant', productData.variant);
      const additionalDescBulletCount = getMultipleNodeLengthByXpath('//div[contains(@class,"prodtabcontents current")]/ul/li');
      addEleToDoc('addDescBulletCount', additionalDescBulletCount);

      function getMultipleNodeLengthByXpath (xpath) {
        const element = document.evaluate(xpath, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return element.snapshotLength;
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element)
        const text = element.textContent;
        return text;
      }

      function findProductDetails () {
        const xpath = `//script[contains(.,'productDetails')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element)
        const scriptContent = element.textContent;
        let scriptContentArr = scriptContent.split(';')
        scriptContentArr = scriptContentArr.filter(function (item) { if (item.includes('productsObject.')) return item; });
        let productDetails = {};
        for (let i = 0; i < scriptContentArr.length; i++) {
          let chunk = scriptContentArr[i];
          let productProp = chunk.substring(chunk.indexOf('productsObject.') + 'productsObject.'.length, chunk.indexOf(" ="));
          let productPropVal = chunk.substring(chunk.indexOf(`productsObject.${productProp} = "`) + `productsObject.${productProp} = "`.length, chunk.lastIndexOf("\""));
          productDetails[productProp] = productPropVal;
        }
        return productDetails;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div')
        prodEle.id = key
        prodEle.textContent = value
        prodEle.style.display = 'none'
        document.body.appendChild(prodEle)
      }
    });
    return await context.extract(productDetails);
  }
};
