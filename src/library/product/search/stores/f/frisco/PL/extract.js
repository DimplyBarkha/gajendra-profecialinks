const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'frisco',
    transform: transform,
    domain: 'frisco.pl',
  },
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    //get the prodcut code from url
    async function getID() {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('a.product-box_image')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const product = document.querySelectorAll('a.product-box_image');
      const regex = '/'
      for (let i = 0; i < product.length; i++) {
        //let tag = product[i].querySelector('a.product-box_image');
        let str = product[i].attributes[0].nodeValue; //Get the entire href
        var strArray = str.split(regex);
        var productIDArr = strArray[1].split(","); //Take the second part.
        let pid = productIDArr[1];
        addHiddenDiv('id1', pid, i);
      }
    }
    await context.evaluate(getID);
    //provide scroll time  for loading data
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 500;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};