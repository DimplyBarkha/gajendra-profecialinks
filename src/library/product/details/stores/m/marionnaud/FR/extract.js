const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    transform: cleanUp,
    domain: 'marionnaud.fr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      var category = window.dataLayer[0].ecommerce.detail.products[0].category;
      addElementToDocument('category', category);
    // @ts-ignore
    var brandText = window.dataLayer[0].ecommerce.detail.products[0].brand;
      addElementToDocument('brandText', brandText);
    // @ts-ignore
    var availabilityText = window.dataLayer[0].ecommerce.detail.products[0].stock;
      addElementToDocument('availabilityText', availabilityText)
       // @ts-ignore
    var variantId = window.dataLayer[0].ecommerce.detail.products[0].variant;
    addElementToDocument('variantId', variantId)
    //gtin
    var productInfo=document.getElementById('auditedOpinionsInfo').getAttribute('data-auditedopinionurl');
    var splitProductInfo=productInfo.split('&')
    console.log(splitProductInfo)
    var getGtin=splitProductInfo[5]
    var gtinData=getGtin.split('=')
    var gtinValue=gtinData[1]
    addElementToDocument('gtinValue', gtinValue)
    //category
    var getCategory=splitProductInfo[6]
    var categoryData=getCategory.split('=')
    var categoryValue=categoryData[1]
    addElementToDocument('categoryValue', categoryValue)
     // @ts-ignore
     var warningInfo=''
     if(document.getElementsByClassName('prodInfoTxtData')[1].innerHTML.includes("WARNING")){
      alert('hi')
      // @ts-ignore
      var warningInfo = document.getElementsByClassName('prodInfoTxtData')[1].innerHTML
      addElementToDocument('warningInfo', warningInfo);
     }
     else{
       warningInfo = ""
      addElementToDocument('warningInfo', warningInfo);
     }
     // @ts-ignore
    // var getProductName=splitProductInfo[2]
    // var productNameData=getProductName.split('=')
    // var productName=productNameData[1]
    // addElementToDocument('productName', productName)
    });

    await context.extract(productDetails);
  },
};
