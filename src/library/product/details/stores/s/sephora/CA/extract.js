
const { transform } = require('../CA/format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.ca',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('button[data-at="selected_swatch"] img').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform:transform[0] });
    try {
      await context.evaluate(() => {
        Array.from(document.querySelectorAll('[data-at="sku_item_brand"],[data-at="product_brand_label"]')).forEach(elm => elm.innerText = elm.innerText + ' ');
      });
    } catch (err) {
      console.log('Error adding UPDP spacing');
    }
    /*await context.evaluate(function(){
      let newDivId='jdCustomVariantId';
      const newDiv = document.createElement('div');
      newDiv.id = newDivId;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    })*/
    for (let index = 2; index <= variantCount; index++) {
      try {
        await context.evaluate(function(index,variantCount){ 
          const imgele=document.querySelector(`button[data-at="selected_swatch"]:nth-child(${index}) img`).src;
          console.log('imgele:',imgele);
          let skuArr=imgele.replace('https://www.sephora.com/productimages/sku/s','').split('+s');
          console.log('skuArr:',skuArr);
          if(skuArr.length>1){
            let parentDiv=document.querySelector('div#jdCustomVariantId');
            let newDivId='jdCustomVariantId_inner_'+index;
            const newDiv = document.createElement('div');
            newDiv.id = 'jdCustomVariantId';
            newDiv.textContent = skuArr[0];
            newDiv.style.display = 'none';
            //parentDiv.appendChild(newDiv);
            document.body.appendChild(newDiv);
          }
        },index,variantCount);
        
        //break;
        await context.click(`button[data-at="selected_swatch"]:nth-child(${index})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        //await context.extract(productDetails, { type: 'APPEND', transform:transform  });
        if (variantCount !== index) {
          await context.extract(productDetails, { type: 'APPEND', transform:transform  });
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform:transform  });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants',error);
      }
    }
  },
};
