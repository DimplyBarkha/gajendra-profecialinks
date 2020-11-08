
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;



  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };
  // @ts-ignore
  var brandText = window.dataLayer[0].ecommerce.detail.products[0].brand;
  addHiddenDiv('brandText', brandText);
    // @ts-ignore
    var listPrice=window.dataLayer[0].ecommerce.detail.products[0].price
    listPrice=listPrice+'€'
    addHiddenDiv('listPrice', listPrice);
  // @ts-ignore
  var availabilityText = window.dataLayer[0].ecommerce.detail.products[0].stock;
  addHiddenDiv('availabilityText', availabilityText)
     // @ts-ignore
  var variantId = window.dataLayer[0].ecommerce.detail.products[0].variant;
  addHiddenDiv('variantId', variantId)
  //gtin
  var productInfo=document.getElementById('auditedOpinionsInfo').getAttribute('data-auditedopinionurl');
  var splitProductInfo=productInfo.split('&')
  console.log(splitProductInfo)
  var getGtin=splitProductInfo[5]
  var gtinData=getGtin.split('=')
  var gtinValue=gtinData[1]
  addHiddenDiv('gtinValue', gtinValue)
 
   // @ts-ignore
   var warningInfo=''
   if(document.getElementsByClassName('prodInfoTxtData')[1].textContent.includes("WARNING")){
    alert('hi')
    // @ts-ignore
    var warningInfo = document.getElementsByClassName('prodInfoTxtData')[1].textContent
    addHiddenDiv('warningInfo', warningInfo);
   }
   else{
     warningInfo = ""
     addHiddenDiv('warningInfo', warningInfo);
   }
   // @ts-ignore
  // var getProductName=splitProductInfo[2]
  // var productNameData=getProductName.split('=')
  // var productName=productNameData[1]
  // addElementToDocument('productName', productName)

    const price = document.querySelector('div.finalPrice');
    if (price && price.textContent) {
      let priceText = price.textContent;
      if (priceText.includes('€')) {
        priceText = priceText.replace('€', '.');
        priceText=priceText+'€'
      }
      addHiddenDiv('priceText', priceText);
    }
  });


  return await context.extract(productDetails, { transform });
}

const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    transform: cleanUp,
    domain: 'marionnaud.fr',
  },
  inputs: [ 
  ],
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,

};
