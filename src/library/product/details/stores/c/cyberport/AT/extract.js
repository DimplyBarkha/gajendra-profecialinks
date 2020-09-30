const{cleanUp} = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'cyberport',
    transform: cleanUp,
    domain: 'cyberport.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain ,transform: transformParam}, context, { productDetails }) => {     
    
    await context.evaluate(async function () {       
     const productInfo = preFetchProductDetails();
       addEleToDoc('divhiddenproductAvgRating', productInfo['productAvgRating']);
       addEleToDoc('divhiddenproductRatingCount', productInfo['productRatingCount']);
       addEleToDoc('divhiddenproductGrossPrice', productInfo['productGrossPrice'].analyticsFormat);
      function preFetchProductDetails () {
        let productInfo = findProductDetails('//section//@data-productinfofordatalayer');                        
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
