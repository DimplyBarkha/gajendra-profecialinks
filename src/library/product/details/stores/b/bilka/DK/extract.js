const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'bilka',
    transform,
    domain: 'bilka.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain ,transform: transformParam}, context, { productDetails }) => {     
    
    await context.evaluate(async function () {       
     const productInfo = preFetchProductDetails();          
     var combinepriceCurrency= productInfo['offers']['price'] + ':' + productInfo['offers']['priceCurrency'];     
      addEleToDoc('hidskuId', productInfo['sku']);
      addEleToDoc('hidpriceCurrency', combinepriceCurrency);      
     
      function preFetchProductDetails () {
        let productInfo = findProductDetails('//script[@data-v-6280c757 and @type="application/ld+json"]');                        
        productInfo = JSON.parse(productInfo.textContent);        
        return productInfo;
      }      

      function findProductDetails (xpath) {        
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;                
        const productDetails = element;
        return productDetails;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }         
         
    });      
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};
