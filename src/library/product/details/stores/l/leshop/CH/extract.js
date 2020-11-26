const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'leshop',
    transform: transform,
    domain: 'leshop.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForFunction(function () {
      return Boolean(document.querySelector('aside[class="product-detail-image"]>div>div') || document.evaluate('//aside[@class="product-detail-image"]/div/div', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 90000 });
    await context.evaluate(async () => {
      // @ts-ignore
      const productID = document.querySelector('dd[class="pid"]').innerText;
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // @ts-ignore
      const image = document.querySelectorAll('aside[class="product-detail-image"]>div>div')[0].style.backgroundImage;
      addHiddenDiv('image', image.split('"')[1]);
      const priceID = productID + "-current-price";
      // @ts-ignore
      addHiddenDiv('price', document.querySelector('span[id="' + priceID + '"]').innerText);
      const quantity = productID + "-weight";
      // @ts-ignore
      const rawquantity = document.querySelector('span[id="' + quantity + '"]').innerText
      addHiddenDiv('quantity', rawquantity.split('x')[1]);
      addHiddenDiv('packSize', rawquantity.split('x')[0]);
      addHiddenDiv('variantId', productID);
      addHiddenDiv('image', image.split('"')[1]);

      const directions = "product-detail-" + productID + "-usage";
      // @ts-ignore
      addHiddenDiv('directions', document.querySelector('dd[id="' + directions + '"]').innerText);
      const ingredientsList = "product-detail-" + productID + "-ingredients";
      // @ts-ignore
      addHiddenDiv('ingredientsList', document.querySelector('dd[id="' + ingredientsList + '"]').innerText);
    });
    return await context.extract(productDetails, { transform });
  },
};

