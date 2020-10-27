const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrenner',
    transform,
    domain: 'lojasrenner.com',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async (parentInput) => {
    // function addHiddenDiv1 (id, content) {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = id;
    //   newDiv.textContent = content;
    //   newDiv.style.display = 'none';
    //   document.body.appendChild(newDiv);
    // }
    function addHiddenDiv (selector, id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll(selector)[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let url = window.location.href;
    console.log('url: ', url);
    let url1 = url ? url.split('?sku=') : '';
    let urlFinal;
    if(url1.length > 1){
      urlFinal = url1[0]
    } 
  let colorVariant = document.querySelectorAll('div.js-only-one-level label.label');
  console.log('colorVariant: ', colorVariant);
  if(colorVariant){
    for (let index = 0; index < colorVariant.length; index++) {
      const element = colorVariant[index].querySelector('input');
      console.log('element: ', element);
      let skuVal = element ? element.value : ''
      console.log('skuVal: ', skuVal);
      if(urlFinal.includes('?sku=')){
       let removeSku = urlFinal ? urlFinal.split('?sku=') : '';
       removeSku = removeSku ? removeSku[0] : '';
       addHiddenDiv('div.js-only-one-level label.label span.name','pd_productUrl', urlFinal+'?sku='+skuVal , index);
      }else{
       addHiddenDiv('div.js-only-one-level label.label span.name','pd_productUrl', urlFinal+'?sku='+skuVal , index);
      }
    }
  }
  let sizeVariants = document.querySelectorAll('div.js-only-one-level label.item');
  console.log('sizeVariants: ', sizeVariants);
  if(sizeVariants){
    for (let index = 0; index < sizeVariants.length; index++) {
      const element = sizeVariants[index].querySelector('input');
      console.log('element: ', element);
      let skuVal = element ? element.value : ''
      console.log('skuVal: ', skuVal);
      if(urlFinal.includes('?sku=')){
       let removeSku = urlFinal ? urlFinal.split('?sku=') : '';
       removeSku = removeSku ? removeSku[0] : '';
       addHiddenDiv('div.js-only-one-level label.item div.wrap','pd_productUrl', urlFinal+'?sku='+skuVal , index);
      }else{
       addHiddenDiv('div.js-only-one-level label.item div.wrap','pd_productUrl', urlFinal+'?sku='+skuVal , index);
      }
    }
  }

  if((colorVariant.length == 0) && (sizeVariants.length == 0)){
  console.log("IN VO VARIANTS")
  let productNotAvail = document.querySelector('div.product_404');
  console.log('productNotAvail: ', productNotAvail);
  if(productNotAvail){
    let skuNum ;
  let url = window.location.href;
  console.log('url: ', url);
  if(url.includes('?sku=')){
    let removeSku = url ? url.split('?sku=') : '';
    if(removeSku.length > 1){
      skuNum = removeSku[removeSku.length-1];
      console.log('skuNum: ', skuNum);
    }
    removeSku = removeSku ? removeSku[0] : '';
    console.log('removeSku: ', removeSku);
    let bodyId = document.querySelector('body.product');
    if(bodyId){
      bodyId.setAttribute("id", "id_you_like")
    }
    addHiddenDiv('div','pd_productUrl',removeSku+'?sku='+skuNum , 1);
    addHiddenDiv('div','pd_productSku',skuNum, 1);
   }else{
    addHiddenDiv('div','pd_productUrl',url+'?sku='+skuNum, 1);
    addHiddenDiv('div','pd_productSku',skuNum, 1);
   }
  }
  }
   
  });
  return await context.extract(variants, { transform });
}