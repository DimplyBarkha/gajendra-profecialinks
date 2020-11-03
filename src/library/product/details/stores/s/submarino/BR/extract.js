const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    transform: cleanUp,
    domain: 'submarino.com.br',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const variantTypes = document.querySelectorAll('div[type] > div[type]');

      const variantsObj = {};
      Array.from(variantTypes).map(el => {
        variantsObj[el.getAttribute('type')] = el.childElementCount;
      });
      if (Object.keys(variantsObj).length > 1) {
        variantsObj.variants = Object.values(variantsObj).reduce((a, b) => a * b);
        addElementToDocument('variantsCount', variantsObj.variants);
      } else {
        addElementToDocument('variantsCount', Object.values(variantsObj));
      }

      addElementToDocument('productUrl', window.location.href);
      const hiddenVideoInImg = document.evaluate('//img[contains(@alt, \'Vídeo\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (hiddenVideoInImg) hiddenVideoInImg.click();

      const outOfStockInfo = document.querySelector('span[class*="out-of-stock"]');
      outOfStockInfo ? addElementToDocument('outOfStock', 'Out of stock') : addElementToDocument('inStock', 'In stock');
      const createId = (str) => str.toLowerCase().split(/[ ,.\t]+/)[0];
      const dataSheet = document.querySelectorAll('section table tbody tr');
      Array.from(dataSheet).map(node => {
        node.setAttribute('id', createId(node.innerText));
      });
    });
    await context.extract(productDetails, { transform });
  },
};
