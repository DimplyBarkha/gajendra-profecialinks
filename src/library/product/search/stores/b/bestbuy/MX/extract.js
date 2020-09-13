const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com.mx',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv1 (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div.product-line-item-line div.row')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      //-----------------------------------------------------------
      // @ts-ignore
      let tc_vars = window.INITIAL_PAGE_STATE;
      console.log('tc_vars: ', tc_vars);
      let listProduct = tc_vars ? tc_vars.products : '';
      console.log('listProduct: ', listProduct);
      var objs = listProduct.map(function (x) {
        return {
          
          skuId: x['skuId'], //product_sku
          upc: x['upc'] //product_url_picture
        };
      });
      // console.log('objs: ', objs);
      let skus = document.querySelectorAll('div.product-line-item-line li.product-skuId span.sku-value');
      let itemArr = [];
      for (let index = 0; index < skus.length; index++) {
        // @ts-ignore
        let skuIdFinal = skus[index].innerText;
        skuIdFinal = String(skuIdFinal).trim();
        skuIdFinal = skuIdFinal;
        console.log('skuIdFinal: ', skuIdFinal);
        // console.log("Hello",objs)
        let itemObj = new Object();
        let itemId = skuIdFinal;
        console.log('itemId: ', itemId);
        // @ts-ignore
        itemObj.skuId = itemId;
        let src = 'AAA';
        // @ts-ignore
        itemObj.upc = src;
        objs.find(param => {
          console.log('param: ', param, itemObj);
   
          if (param) {
            // @ts-ignore
            if (param.skuId ===  itemObj.skuId) {
              console.log('param.skuId: ', param.skuId);
              console.log('skuIdFinal: ', skuIdFinal);
              console.log("Matched", param.skuId)
              addHiddenDiv('pd_productUpc', param.upc , index);
            }
          }

        });
      }
      //-----------------------------------------------------------
    });
    return await context.extract(productDetails, { transform });
  },
};



