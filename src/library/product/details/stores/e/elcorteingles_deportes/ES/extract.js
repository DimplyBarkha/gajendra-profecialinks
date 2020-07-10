
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_deportes',
    transform: null,
    domain: 'elcorteingles.es',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      normalizeSapce('shippingInfo', '//div[@id="shipping_and_returns"]');
      appendAvailabilityToDom('availability', '//meta[@itemprop="availability"]');

      function appendAvailabilityToDom (elementId, xpath) {
        const avlEle = getEleByXpath(xpath);
        if (avlEle) {
          const avlTxt = avlEle.getAttribute('content');
          if (avlTxt) {
            const avlTxtArray = avlTxt.split('/');
            const availabilityTxt = avlTxtArray[avlTxtArray.length - 1];
            addEleToDoc(elementId, availabilityTxt);
          }
        }
      }

      function normalizeSapce (property, xpath) {
        const docEle = getEleByXpath(xpath);
        const textContent = docEle ? docEle.textContent : null;
        if (textContent) {
          textContent.replace('\n', ' ');
          addEleToDoc(property, textContent);
        }
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        return element;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
    });
    return await context.extract(productDetails);
  },
};
