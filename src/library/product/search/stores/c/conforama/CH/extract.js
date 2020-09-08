
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    transform,
    domain: 'conforama.ch',
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
        const originalDiv = document.querySelectorAll('section#contentSegment article form#addToCartForm')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      let ratingCountSelector = document.querySelector('span[class="avisBaazar"]');
      // @ts-ignore
      let ratingCount = ratingCountSelector ? ratingCountSelector.innerText : '';
      addHiddenDiv1('cc_ratingCount',ratingCount);
      //-----------------------------------------------------------
      // @ts-ignore
      let tc_vars = window.tc_vars;
      console.log('tc_vars: ', tc_vars);
      let listProduct = tc_vars ? tc_vars.list_products : '';
      console.log('listProduct: ', listProduct);
      var objs = listProduct.map(function (x) {
        return {
          itemId: x['product_sku'],
          src: x['product_url_picture']
        };
      });

      let images = document.querySelectorAll('div[class="image-product"] a');
      let itemArr = [];
      for (let index = 0; index < images.length; index++) {
        let itemObj = new Object();
        let itemId = images[index].getAttribute('tcproductclick');
        // @ts-ignore
        itemObj.itemId = itemId;
        // @ts-ignore
        const element = images[index].querySelector('img');
        let src = element ? element.getAttribute('src') : '';
        // @ts-ignore
        itemObj.src = src;
        // @ts-ignore
        // itemArr.push(itemObj);
        objs.find(param => {

          if (param) {
            // @ts-ignore
            if (param.itemId === itemId) {
              console.log("Matched", param.itemId)
              if(src.includes('https')){
               src = src;
              }else{
               src = 'https:'+param.src;
              }
              addHiddenDiv('pd_productImg', src , index);
            }
          }

        });
      }
      //-----------------------------------------------------------
    });
    return await context.extract(productDetails, { transform });
  },
};
