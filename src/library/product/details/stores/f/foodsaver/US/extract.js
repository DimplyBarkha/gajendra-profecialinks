const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'foodsaver',
    transform: transform,
    domain: 'foodsaver.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        const dataObj = JSON.parse(document.querySelector('span.product-object').getAttribute('data-product'));
        if (dataObj) {
          dataObj.id && addHiddenDiv('variantId', dataObj.id);
          dataObj.price && addHiddenDiv('pd_price', dataObj.price);
          dataObj.product_sku && addHiddenDiv('pd_sku', dataObj.product_sku);
          dataObj.brand && addHiddenDiv('pd_brand', dataObj.brand);
        }
      } catch (error) {
        console.log('add variantid failed!!');
      }
      try {
        const dataObjTwo = JSON.parse(document.evaluate('//script[@type="application/ld+json" and contains(text(),"mpn")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText);
        if (dataObjTwo) {
          dataObjTwo.mpn && addHiddenDiv('pd_mpc', dataObjTwo.mpn);
        }
      } catch (error) {
        console.log('add mpc failed!!');
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
