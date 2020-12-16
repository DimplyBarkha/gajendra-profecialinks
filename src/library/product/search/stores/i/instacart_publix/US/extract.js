const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart_publix',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '32821',
  },
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    async function getID() {
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('ul.rmq-1938cd36 items-grid unstyled.li > div#id')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
        }
      const product = document.querySelectorAll('ul.rmq-1938cd36 items-grid unstyled.li > div#id');
      const regex = '_'
      for (let i = 0; i < product.length; i++) {
        let prodcutIDArr = product[i].querySelector('ul.rmq-1938cd36 items-grid unstyled.li > div#id');
        let str = prodcutIDArr[i].nodeValue;
        var strArray = str.split(regex); //Take the second part.
        var pid = strArray[1];
       addHiddenDiv('id1', pid,i);
         }
    }
    await context.evaluate(getID);
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
