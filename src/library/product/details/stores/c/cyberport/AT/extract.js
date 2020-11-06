const{transform} = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'cyberport',
    transform: transform,
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

      if(document.querySelector('div[class="clipThumbnail"]')){
        document.querySelector('div[class="clipThumbnail"]').click();
        function delay(time) {
          return new Promise(function(resolve) { 
              setTimeout(resolve, time)
          });
       }
       await delay(2000);
        document.querySelector('div[id="clipVideo"] img[class*="Playbtn"]').click();
        videoSrc=document.querySelector('div[id="clipVideo"] video source').getAttribute('src');
        console.log(videoSrc+' is video link');
        addEleToDoc('videoLink',videoSrc);
      }
    });
       return await context.extract(productDetails, { transform: transformParam });       
  }, 
};
