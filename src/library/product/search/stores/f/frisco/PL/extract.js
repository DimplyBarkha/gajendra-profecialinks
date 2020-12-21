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
    //call Api fro search Url
 //   var yourUrl = 'https://commerce.frisco.pl/api/offer/products/query?includeCategories=true&pageIndex=1&search=zupa&deliveryMethod=Van&pageSize=150&language=pl&facetCount=150&includeWineFacets=false';
  //   async function load() {
  //     let url = 'https://commerce.frisco.pl/api/offer/products/query?includeCategories=true&pageIndex=1&search=zupa&deliveryMethod=Van&pageSize=150&language=pl&facetCount=150&includeWineFacets=false';
  //     let obj = null;
      
  //     try {
  //         obj = await (await fetch(url)).json();
  //     } catch(e) {
  //         console.log('error');
  //     }
      
  //     console.log("object :"+obj.totalCount);
  // }
  
  // load();



    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};