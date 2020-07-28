
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform: null,
    domain: 'sephora.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    const variantArray = await context.evaluate(function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const element = document.querySelectorAll("script[type='application/ld+json']");
      let variantObj;
      let variantSkuArray = [];
      if(element.length > 0) {
        for(let i = 0; i < element.length; i++){
          let variantText = element[i].innerText;
          if(variantText.includes("sku")){
            let varObj = JSON.parse(variantText);
            if(varObj){
              variantObj = varObj;
            }
          }
        }
      }
      if(variantObj){
        if(variantObj.offers){
          for(let j = 0; j < variantObj.offers.length; j++){
            if(variantObj.offers[j].sku){
              // addHiddenDiv(`ii_variants`, variantObj.offers[j].sku);

              variantSkuArray.push(variantObj.offers[j].sku)
            }
          }
        }
      }
      if(variantSkuArray.length){
        // debugger
        return variantSkuArray
      } else {
        return null
      }
    });

    if(variantArray){
      for(let i = 0; i < variantArray.length; i++){
        await context.goto(`https://www.sephora.com/search?keyword=${variantArray[i]}`, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await new Promise(resolve => setTimeout(resolve, 5000));
        const addSkuArray = await context.evaluate(function (variants) {
          let variantStr = variants.join(" | ")
            function addHiddenDiv (id, content) {
              const newDiv = document.createElement('div');
              newDiv.id = id;
              newDiv.textContent = content;
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }
            addHiddenDiv(`ii_variants`, variantStr);
            addHiddenDiv(`ii_url`, window.location.href);

        
        }, variantArray);
        await context.extract(productDetails);
      }
    } else {
      return await context.extract(productDetails);
    }

  },
};
