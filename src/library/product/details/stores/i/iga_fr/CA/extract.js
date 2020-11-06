const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'iga_fr',
    transform: cleanUp,
    domain: 'iga.net/fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      var productSku=document.getElementsByClassName('relative js-data-procuct')[0].dataset.product.split(',')
      var sku=productSku[0].split(':')
      var SkuValue=sku[1].split(',')
      console.log("asas"+SkuValue)
      addElementToDocument('SkuValue', SkuValue)
   });
      await context.extract(productDetails);
    },
  
};
