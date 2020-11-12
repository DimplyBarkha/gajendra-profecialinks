const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform: cleanUp,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation: async ({ x }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const productDataNode = document.querySelector('div.jum-product-characteristics');
      const productAttr = productDataNode.getAttribute('data-jum-product-details');
      const productDataObject = JSON.parse(productAttr);
      for (const property in productDataObject) {
        productDataNode.setAttribute(property, productDataObject[property]);
      }
      const pricePerUnitText = document.querySelector('span.jum-product-price__unit-price.color-grey span+span').textContent;
      const pricePerUnitUom = pricePerUnitText.match(/\/(.*)/)[1];
      productDataNode.setAttribute('pricePerUnitUom', pricePerUnitUom);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
