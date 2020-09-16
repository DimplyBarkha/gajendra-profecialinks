const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    transform,
    domain: 'liverpool.com.mx',
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
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  let sku = async function(){
    return await context.evaluate(async (inputs) => {
      let skuAttributeMap;
      console.log('inputs: ', inputs);
      if (inputs) {
        console.log('id: ', inputs);
        if(inputs.url){
        let productId = inputs.url.split('/');
        let length = productId.length;
        if(length > 1){
          productId = productId[length -1];
        }
        if(productId){
          console.log('getDataFromAPI');
          console.log('waiting for api request....');
          let data = {};
          const url = `https://www.liverpool.com.mx/tienda/browse/getVariantDetails?productId=${productId}`;
          var refURL = window.location.href;
  
          const response = await fetch(url, {
            // @ts-ignore
            accept: 'application/json, text/plain, */*',
            method: 'GET',
            mode: 'cors',
          });
          console.log(response)
  
          if (response && response.status === 404) {
            console.log('Product Not Found!!!!');
          }
  
          if (response && response.status === 200) {
            console.log('Product Found!!!!');
            data = await response.json();
            console.log(data, response);
            let variantsData = data ? data.variantsData : 'NO VARIANTS';
            console.log('variantsData: ', variantsData);
            skuAttributeMap = variantsData ? variantsData.skuAttributeMap : 'NO VARIANTS';
            console.log('skuAttributeMap: ', skuAttributeMap);
            // return skuAttributeMap;
          }
        }
        }
      }
      console.log("skuAttributeMapjjjjjjjjjj", skuAttributeMap)
      return skuAttributeMap;
      }, inputs);
  }
  async function preparePage (index, sku, color, price, listPrice, size) {
    await context.evaluate(async (index, sku, color, price, listPrice, size) => {
      console.log('index of variant', index, sku, color, price, listPrice, size);
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
        addHiddenDiv('li_color', color);
        addHiddenDiv('li_price', price);
        addHiddenDiv('li_listPrice', listPrice);
        addHiddenDiv('li_size', size);
        addHiddenDiv('li_sku', sku);
    }, index, sku, color, price, listPrice, size);
  }

   let skuAttributeMap = await sku();
    console.log('skuAttributeMap22222222222222222222: ', skuAttributeMap);
    if(skuAttributeMap){
      const entries = Object.entries(skuAttributeMap);
      let counterIndex = 1;
      let price;
      for (const [sku, skuObj] of entries) {
        counterIndex++;
        if(`${skuObj.promoPrice}` === "0.0"){
        price = `${skuObj.salePrice}`;
        }else{
          price = `${skuObj.promoPrice}`
        }
        await preparePage(counterIndex-1, `${sku}`, `${skuObj.color}`, price, `${skuObj.listPrice}`, `${skuObj.size}`);
        if(counterIndex <= entries.length){
          await context.extract(productDetails, { transform }, { type: 'APPEND' });
        }
      }
    }
    return await context.extract(productDetails, { transform });
    }
