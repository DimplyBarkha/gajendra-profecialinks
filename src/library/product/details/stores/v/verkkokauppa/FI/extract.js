const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    transform,
    domain: 'verkkokauppa.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain ,transform: transformParam}, context, { productDetails }) => {     
    
    await context.evaluate(async function () {       
     const productInfo = preFetchProductDetails();
      addEleToDoc('skuId', productInfo[0].sku);
      addEleToDoc('gtinId', productInfo[0].gtin13);
      addEleToDoc('priceCurrency', productInfo[0].offers[0].priceCurrency);  
     
      function preFetchProductDetails () {
        let productInfo = findProductDetails('//script[@type="application/ld+json"]');                
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
      
      let tempCheck = document.evaluate('//section[contains(@class,"description-container__full-text")]//div//ul//li[contains(text(),"tat")]', document).iterateNext();      
      if(tempCheck !=null)
      {
        let shippingDimensionsData = document.evaluate('//section[contains(@class,"description-container__full-text")]//div//ul//li[contains(text(),"tat")]', document).iterateNext().textContent.trim();      
        addEleToDoc('shippingDimensionsTempId', shippingDimensionsData);
      }

      let tempweightNet = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Moduulin paino")]', document).iterateNext();      
      if(tempweightNet !=null)
      {
        let tempweightNet1 = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Moduulin paino")]', document).iterateNext().textContent.trim();              
        addEleToDoc('weightNettempId', tempweightNet1);
      }

      let tempDescription = document.evaluate('//div[contains(@class, "product-description__description-container")]',document).iterateNext(); 
      if(tempDescription !=null)
      {
        let tempDescription1 = document.evaluate('//div[contains(@class, "product-description__description-container")]', document).iterateNext().textContent.trim();              
        addEleToDoc('descriptionTempId', tempDescription1);
      }

      let tempWeightGross = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Paino")]',document).iterateNext(); 
      if(tempWeightGross !=null)
      {
        let tempWeightGross1 = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Paino")]', document).iterateNext().textContent.trim();              
        addEleToDoc('weightGrossTempId', tempWeightGross1);
      }

      let tempManufactureImage = document.evaluate('//a[contains(@class,"product-shop-logo")]/figure/img/@src',document).iterateNext(); 
      if(tempManufactureImage !=null)
      {
        let tempManufactureImage1 = document.evaluate('//a[contains(@class,"product-shop-logo")]/figure/img/@src', document).iterateNext().textContent.trim();              
        addEleToDoc('tempManufactureImage1', tempManufactureImage1);
      }

      
      let tempDescriptionBullet1 = document.querySelectorAll('div.product-description__description-container div ul li').length;   
      addEleToDoc('tempDescriptionBullet1', tempDescriptionBullet1);      
    });   

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector('#tabs-page-select-tab1', { timeout: 50000 });
    const productAvailable = await isSelectorAvailable('nav[class^="Tabs"]');
    if(productAvailable)
    {      
      await context.click('#tabs-page-select-tab1');
      await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
      await context.waitForSelector('section.product-details', { timeout: 55000 });
    }
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};
