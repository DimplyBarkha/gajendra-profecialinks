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
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    //   async function getID() {
    //     function addHiddenDiv(id, content, index) {
    //       const newDiv = document.createElement('div');
    //       newDiv.id = id;
    //       newDiv.textContent = content;
    //       newDiv.style.display = 'none';
    //       const originalDiv = document.querySelectorAll('td.imageUrl.depth_2')[index];
    //       originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    //     }
    //    // var product = getAllXpath('//td[@class="productId depth_1"]', 'nodeValue');
    //     const product = document.querySelectorAll('td.productId.depth_1');
    //     console.log("product length :::"+ product.length);
    //     if (product.length >= 1) {
    //       for (var i = 0; i < product.length; i++) {
    //         // @ts-ignore
    //         addHiddenDiv('id', product[i].innerText, i);
    //       }
    //     }
    //   }
    //   await context.evaluate(getID);
    return await context.extract(dependencies.productDetails, { transform: transform });
  }
};