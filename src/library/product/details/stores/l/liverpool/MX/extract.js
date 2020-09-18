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
  let sku = async function () {
    return await context.evaluate(async (inputs) => {
      let skuAttributeMap;
      if (inputs) {
        if (inputs.url) {
          let productId = inputs.url.split('/');
          let length = productId.length;
          if (length > 1) {
            productId = productId[length - 1];
          }
          if (productId) {
            let data = {};
            const url = `https://www.liverpool.com.mx/tienda/browse/getVariantDetails?productId=${productId}`;
            var refURL = window.location.href;

            const response = await fetch(url, {
              // @ts-ignore
              accept: 'application/json, text/plain, */*',
              method: 'GET',
              mode: 'cors',
            });
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
      return skuAttributeMap;
    }, inputs);
  }
  async function preparePage(index, sku, variantCount, color, price, listPrice, size) {
    await context.evaluate(async (index, sku, variantCount, color, price, listPrice, size) => {
      console.log('index of variant', index, sku, color, price, listPrice, size);
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (variantCount === 0) {
        addHiddenDiv('li_variantCount', 0);
      } else {
        addHiddenDiv('li_variantCount', variantCount);
      }
      // let enhancedContent = document.querySelector('div[id="flix-inpage"]').innerHTML;
      // enhancedContent = enhancedContent ? enhancedContent.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      // addHiddenDiv('li_enhancedContent', enhancedContent);

      let array1 = document.querySelectorAll('div[class="o-product__description"] ul li a');
      for (let index = 0; index < array1.length; index++) {
        const element = array1[index];
        const elementSku = element ? element.getAttribute('data-skuid') : '';
        if (sku === elementSku) {
          console.log('CLICKING1 sku: ', sku);
          // @ts-ignore
          element.click();
          await extractDataFromJSON();
        }

      }
      
      async function extractDataFromJSON() {
        const JsonStr = findJsonObj();
        console.log('JsonStr: ', JsonStr);
        let aggregateRating = JsonStr ? JsonStr.aggregateRating : '';
        let ratingValue = aggregateRating ? aggregateRating.ratingValue : '';
        ratingValue = ratingValue ? Number(ratingValue).toFixed(1) : '';
        addHiddenDiv('li_ratingValue', ratingValue);
        let ratingCount = aggregateRating ? aggregateRating.reviewCount : '';
        addHiddenDiv('li_ratingCount', ratingCount);
        let brand = JsonStr ? JsonStr.brand : '';
        brand = brand ? brand.name : '';
        addHiddenDiv('li_brand', brand);
        let description = JsonStr ? JsonStr.description : '';
        addHiddenDiv('li_description', description);
        let availibility = JsonStr ? JsonStr.offers : '';
        availibility = availibility ? availibility.availability : 'In Stock';
        if (availibility.includes('InStock')) {
          availibility = 'In Stock';
        } else {
          availibility = 'Out Of Stock';
        }
        addHiddenDiv('li_availibility', availibility);
      }
      let array2 = document.querySelectorAll('div[class="o-product__description"] ul li button');
      for (let index = 0; index < array2.length; index++) {
        const element = array2[index];
        const elementSku = element ? element.getAttribute('data-skuid') : '';
        if (sku === elementSku) {
          console.log('CLICKING2 sku: ', sku);
          // @ts-ignore
          element.click();
          await extractDataFromJSON();
        }
      }
      if((array1.length <= 0) && (array2.length <= 0)){
        await extractDataFromJSON();
      }
      function findJsonObj() {
        try {
          let xpath;
          const xpath1 = `//script[@class="next-head" and contains(.,'"brand":')]`;
          console.log('xpath1: ', xpath1);
          const xpath2 = `//script[@class="next-head" and contains(., "AggregateRating")]`;
          console.log('xpath2: ', xpath2);
          if(xpath1){
           xpath = xpath1;
          }else if(xpath2){
            xpath = xpath2;
          }
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let jsonStr = element.textContent;
          jsonStr = jsonStr.trim();
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log(error.message);
        }
      }
      let variantInfoArr = [];
      if (color !== undefined) {
        addHiddenDiv('li_color', color);
        variantInfoArr.push(color);
      }
      if (size !== undefined) {
        addHiddenDiv('li_size', size);
        variantInfoArr.push(size);
      }
      let variantInfo = variantInfoArr.join(' ');
      addHiddenDiv('li_variantInfo', variantInfo);
      addHiddenDiv('li_price', price);
      addHiddenDiv('li_listPrice', listPrice);
      addHiddenDiv('li_sku', sku);
    }, index, sku, variantCount, color, price, listPrice, size);
  }

  let skuAttributeMap = await sku();
  if (skuAttributeMap) {
    const entries = Object.entries(skuAttributeMap);
    let counterIndex = 1;
    let price;
    for (const [sku, skuObj] of entries) {
      counterIndex++;
      if (`${skuObj.promoPrice}` === "0.0") {
        price = `${skuObj.salePrice}`;
      } else {
        price = `${skuObj.promoPrice}`
      }
      let variantCount = entries.length;
      await preparePage(counterIndex - 1, `${sku}`, variantCount, `${skuObj.color}`, price, `${skuObj.listPrice}`, `${skuObj.size}`);
      if ((counterIndex <= entries.length)) {
        console.log(' entries.length: ', entries.length);
        console.log('counterIndex: ', counterIndex);
        await context.extract(productDetails, { transform }, { type: 'APPEND' });
      }
    }
  }
  return await context.extract(productDetails, { transform });
}
