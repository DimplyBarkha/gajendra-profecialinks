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
async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  
  await context.evaluate(async (parentInput) => {

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
     let descElement1;
     let description1 = document.querySelector('div.desc');
     descElement1 = description1 ? description1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
     addElementToDocument('bb_description',descElement1);
     let productAvaibility;
     let notAvailable = document.querySelector('div.product_404');
     if(notAvailable){
      productAvaibility = 'Out of Stock';
     }
     let available = document.querySelector('button.buy_button.js-buy');
     if(available){
      productAvaibility = 'In Stock';
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
    });
    return await context.extract(productDetails, { transform });
    }
