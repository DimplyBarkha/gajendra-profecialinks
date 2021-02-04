const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    transform: cleanUp,
    domain: 'lookfantastic.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('ul[class="productVariations_colorList"] li button')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      try {
        var len = document.querySelectorAll('ul[class="productVariations_colorList"] li').length
        for (let i = 0; i < len; i++) {
          // @ts-ignore
          var id = document.querySelectorAll('ul[class="productVariations_colorList"] li button')[i].click()
          await new Promise(r => setTimeout(r, 3000));
          let variantId1 = document.querySelector('div.productVariations div').getAttribute('data-child-id')
          console.log("hai", variantId1, i);
          addHiddenDiv("variantId", variantId1, i)
        }
      } catch (error) {

      }
    });
    await context.extract(productDetails);
  },
};

