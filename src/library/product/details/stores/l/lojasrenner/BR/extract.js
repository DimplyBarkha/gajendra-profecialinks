const {transform} = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrenner',
    transform,
    domain: 'lojasrenner.com',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  await context.evaluate(async (inputs) => {
    console.log("BEFOIRE URL", inputs);
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    //-----------------------
  //   let url = window.location.href;
  //   console.log('url: ', url);
  //  let fSku;
  //  let sku1 = url ? url.split('?sku=') : '';
  //  console.log('sku1: ', sku1);
  //  let length = sku1.length;
  //  if(length > 1){
  //   fSku = sku1[length-1];
  //   console.log('fSku: ', fSku);
  //  }
  let urlInput = inputs.url;
    console.log('url: ', urlInput);
    let url1 = urlInput ? urlInput.split('?sku=') : '';
    let fSku;
    if(url1.length > 1){
      fSku = url1[url1.length - 1]
      console.log('skuFinal: ', fSku);
    } 
   //------------------------------
   let sizeVariants = document.querySelectorAll('div.js-only-one-level div.form_item');
   if(sizeVariants){
    for (let index = 0; index < sizeVariants.length; index++) {
      const element = sizeVariants[index];
      // @ts-ignore
      let variants= sizeVariants[index].querySelector('div.infos span.ref');
      // @ts-ignore
      let datasetSku = variants ? variants.innerText.replace('Ref:', '').replace('REF:','').trim() : '';
      console.log('datasetSku: ', datasetSku);
      if(fSku === datasetSku){
        console.log('sku: ', fSku);
        // element.classList.add("selected");
        console.log('element: ', element);
         // @ts-ignore
         element.querySelector('input').click();
        let price = element.querySelector('span.best_price');
        // @ts-ignore
        price = price ? price.innerText : '';
        console.log('price: ', price);
        addElementToDocument('pd_price',price);
        let size = element.querySelector('span.size');
        // @ts-ignore
        size = size ? size.innerText : '';
        console.log('size: ', size);
        addElementToDocument('pd_size',size);
        let oldPrice = element.querySelector('span.old_price');
        // @ts-ignore
        oldPrice = oldPrice ? oldPrice.innerText : '';
        addElementToDocument('pd_oldPrice',oldPrice); 
        let availibility = element.querySelector('span.unavailable.js-preWarnMe');
        // @ts-ignore
        availibility = availibility ? availibility.innerText : '';
        let availableStatus;
        // @ts-ignore
        if(availibility.includes('INDISPONÍVEL')){
          availableStatus ="Out of Stock";
        }else{
          availableStatus ="In Stock";
        }
        addElementToDocument('pd_availability',availableStatus); 
      }
    }
   }
    //----------------------
    let colorVariant = document.querySelectorAll('div.js-only-one-level label.label');
   if(colorVariant){
    for (let index = 0; index < colorVariant.length; index++) {
      const element = colorVariant[index];
      // @ts-ignore
      let variants= colorVariant[index].querySelector('input');
      // @ts-ignore
      let datasetSku = variants ? variants.value : '';
      console.log('datasetSku: ', datasetSku);
      if(fSku === datasetSku){
        console.log('sku: ', fSku);
        // element.classList.add("selected");
        console.log('element: ', element);
         // @ts-ignore
         element.querySelector('input').click();
        let price = element.querySelector('span.best_price');
        // @ts-ignore
        price = price ? price.innerText : '';
        addElementToDocument('pd_price',price);
        let oldPrice = element.querySelector('span.old_price');
        // @ts-ignore
        oldPrice = oldPrice ? oldPrice.innerText : '';
        addElementToDocument('pd_oldPrice',oldPrice); 
      }
    }
   }
    //--------------------------------------
     let descElement1;
     let description1 = document.querySelector('div.desc');
     descElement1 = description1 ? description1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace(/\&nbsp;/g, '').trim() : '';
     addElementToDocument('bb_description',descElement1);
     let productAvaibility;
     let notAvailable = document.querySelector('div.product_404');
     if(notAvailable){
       console.log('notAvailable: ', notAvailable);
      productAvaibility = 'Out of Stock';
     }
     
     addElementToDocument('bb_availibility',productAvaibility);
     function findJsonObj (scriptSelector) {
      try {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
    let str = '"@type":"Product"';
    let JSONArr = findJsonObj(str);
    console.log(JSONArr , 'JSONArr');
     let brandText = JSONArr ? JSONArr.brand : ''
     let brand = brandText ? brandText.name : ''
     addElementToDocument('bb_brand', brand);
     let sku = JSONArr ? JSONArr.sku : ''
     addElementToDocument('bb_sku', sku);
     let mpc = JSONArr ? JSONArr.mpn : ''
     addElementToDocument('bb_mpc', mpc);
    }, inputs);
    return await context.extract(productDetails, { transform });
    }
