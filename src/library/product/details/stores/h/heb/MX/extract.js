const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'heb',
    transform: cleanUp,
    domain: 'heb.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        // @ts-ignore
      let ingrediants=document.querySelectorAll("div[class='product-tab-content desc']")[0].innerText;
      let split_ingrediants=ingrediants.split('INGREDIENTES')[1];
      addElementToDocument('ingrediants', split_ingrediants)
        
      } catch (error) {
        
      }
      
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
