module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    transform: null,
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
      
      let tempCheck = document.evaluate('//section[contains(@class,"description-container__full-text")]//div//ul//li[contains(text(),"Mitat")]', document).iterateNext();      
      if(tempCheck !=null)
      {
        let shippingDimensionsData = document.evaluate('//section[contains(@class,"description-container__full-text")]//div//ul//li[contains(text(),"Mitat")]', document).iterateNext().textContent.trim();      
        addEleToDoc('shippingDimensionsTempId', shippingDimensionsData);
      }

      let tempweightNet = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Moduulin paino")]', document).iterateNext();      
      if(tempweightNet !=null)
      {
        let tempweightNet1 = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Moduulin paino")]', document).iterateNext().textContent.trim();              
        addEleToDoc('weightNettempId', tempweightNet1);
      }
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
