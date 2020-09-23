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
    
    await context.waitForSelector('div.v-application--wrap', { timeout: 50000 });

    await context.evaluate(async function () {       
     const productInfo = preFetchProductDetails();          
     var combinepriceCurrency= productInfo['offers']['price'] + ' ' + productInfo['offers']['priceCurrency'];     
     //var combinepriceCurrency= productInfo['offers']['price'];     
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

      let tempadditionalDescBulletInfo = document.querySelectorAll('div.product-panel-slot div.description').length;               
      if(tempadditionalDescBulletInfo > 0)
      {
        let i = 0;
        const nodeList = document.querySelectorAll('div.product-panel-slot div.description');   
        let variantArray = "";
        nodeList.forEach(element => {                    
            variantArray += `${element.innerHTML.replace(/\r\n|\r|\n/g, '')} `;
        });                

        variantArray = variantArray.replace(/<a[^>]*>|<\/a>/g,'');   
        variantArray = variantArray.replace(/<p[^>]*>|<\/p>/g,'');         
        variantArray = variantArray.replace(/<div[^>]*>|<\/div>/g,'');         
        variantArray = variantArray.replace(/<br[^>]*>|<\/div>/g,'');  
        variantArray = variantArray.replace(/<strong[^>]*>|<\/strong>/g,'');         
        variantArray = variantArray.replace(/<bold[^>]*>|<\/bold>/g,'');
        variantArray = variantArray.replace(/<ul[^>]*>|<\/ul>/g,'');
        variantArray = variantArray.replace(/<h3[^>]*>|<\/h3>/g,'');
        variantArray = variantArray.replace(/<li[^>]*>/g,''); 
        variantArray = variantArray.replace(/<\/li>/g,' ||');
        variantArray = variantArray.replace('&nbsp;','');
        variantArray = variantArray.replace(/&amp;nbsp;/g, '');
        variantArray = variantArray.replace(/\u00a0/g, '');
        variantArray = variantArray.replace(/&nbsp;/gi,"s");

        let tempindex = variantArray.lastIndexOf('||');          
        let tempVariantArray = variantArray.substr(0,tempindex -1); 
        let tempVariantArray1 = variantArray.substr(tempindex + 2,variantArray.length); 
        variantArray =  tempVariantArray + tempVariantArray1;        
        
        variantArray = variantArray.replace(/&amp;nbsp;/g, '');
        variantArray = variantArray.replace(/\s\s+/g, ' ');

        variantArray = variantArray.replace(/\r\n|\r|\n/g, ' ')
                      .replace(/&amp;nbsp;/g, ' ')
                      .replace(/&amp;#160/g, ' ')
                      .replace(/\u00A0/g, ' ')
                      .replace(/\s{2,}/g, ' ')
                      .replace(/"\s{1,}/g, '"')
                      .replace(/\s{1,}"/g, '"')
                      .replace(/^ +| +$|( )+/g, ' ')                      
                      .replace(/[\x00-\x1F]/g, '')
                      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

        addEleToDoc('tempdescriptionId', variantArray);    
      }

    });      
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};
