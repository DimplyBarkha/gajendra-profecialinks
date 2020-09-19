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

      let tempweightNet = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Paino")]', document).iterateNext();      
      if(tempweightNet !=null)
      {
        let tempweightNet1 = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Paino")]', document).iterateNext().textContent.trim();              
        let tempweightNet2 = tempweightNet1.split(':');
        if(tempweightNet2 !=null)
        { 
          let tempweightNet3 = tempweightNet2[1];  
          let tempweightNet4=tempweightNet2[1];          
          if(tempweightNet3.indexOf("kg") ==-1)
          {
            tempweightNet4 = tempweightNet2[1] + ' kg';
          }             
          if(tempweightNet1.indexOf("runko") > 0 )          
          {            
            tempweightNet4 =  tempweightNet2[1].split('/')[1];            
          }                         
          addEleToDoc('weightNettempId', tempweightNet4);
        }
        
      }

      let tempDescription = document.evaluate('//div[contains(@class, "product-description__description-container")]',document).iterateNext(); 
      if(tempDescription !=null)
      {
        let tempDescription1 = document.evaluate('//div[contains(@class, "product-description__description-container")]', document).iterateNext().textContent.trim();              
        addEleToDoc('descriptionTempId', tempDescription1);
      }

      // let tempWeightGross = document.evaluate('//section[contains(@class,"product-details")]/div/ul/li[contains(text(),"Paino")]',document).iterateNext(); 
      // if(tempWeightGross !=null)
      // {
      //   let tempWeightGross1 = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Paino")]', document).iterateNext().textContent.trim();              
      //   addEleToDoc('weightGrossTempId', tempWeightGross1);
      // }

      let tempManufactureImage = document.evaluate('//a[contains(@class,"product-shop-logo")]/figure/img/@src',document).iterateNext(); 
      if(tempManufactureImage !=null)
      {
        let tempManufactureImage1 = document.evaluate('//a[contains(@class,"product-shop-logo")]/figure/img/@src', document).iterateNext().textContent.trim();              
        addEleToDoc('tempManufactureImage1', tempManufactureImage1);
      }

       //let tempVideos = document.evaluate('//iframe//@src',document).iterateNext();              
      // if(tempVideos !=null)
      // {
      //   let tempVideos1 = document.evaluate('//ul[contains(@class,"product-description-links")]//iframe//@src', document).iterateNext().textContent.trim();              
      //   alert(tempVideos1);
      //   addEleToDoc('tempVideosId', tempVideos1);
      // }

      //let tempadditionalDescBulletInfo1 = document.querySelector('ul.product-description-links iframe');   
      //alert(tempadditionalDescBulletInfo1);
      // tempadditionalDescBulletInfo1.forEach(element => {
      //   alert(element.innerHTML);
      // });           

      // let tempadditionalDescBulletInfo = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul[1]//li',document).iterateNext(); 
      // if(tempadditionalDescBulletInfo !=null)
      // {
      //   let tempadditionalDescBulletInfo1 = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul[1]', document).iterateNext().childNodes.length;                      
      //   alert(tempadditionalDescBulletInfo1);
      //   //let temptest=tempadditionalDescBulletInfo1.split["."];        
      //   addEleToDoc('tempadditionalDescBulletInfoId', tempadditionalDescBulletInfo1);
      // }

      let tempadditionalDescBulletInfo = document.querySelectorAll('div.product-description__description-container div ul li').length;   
      if(tempadditionalDescBulletInfo > 0)
      {
        let i = 0;
        const nodeList = document.querySelectorAll('div.product-description__description-container div ul li');   
        let variantArray = "";
        nodeList.forEach(element => {
          if(variantArray.length===0)
          {
            variantArray= element.innerHTML;
          }
          else{
            variantArray= variantArray + " || " +  element.innerHTML;
          }
          
        });          
        addEleToDoc('tempadditionalDescBulletInfoId', variantArray);    
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
