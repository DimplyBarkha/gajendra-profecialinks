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
     //var combinepriceCurrency= productInfo['offers']['price'] + ':' + productInfo['offers']['priceCurrency'];     
     var combinepriceCurrency= productInfo['offers']['price'];     
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
                
        const variantArray1 = variantArray.split('<p>');  
        let tempstring='';      
        for (let index = 0; index < variantArray1.length; index++) {
          var tempData= variantArray1[index];
            tempData = tempData.replace('</p>','');
            tempData = tempData.replace('<ul>','');
            tempData = tempData.replace('</ul>','');
            tempData = tempData.replace('<strong>','');
            tempData = tempData.replace('</strong>','');
          if(tempData.indexOf('<li>') !==-1)
          {
            tempData = tempData.replace('</p>','');
            tempData = tempData.replace('<ul>','');
            tempData = tempData.replace('</ul>','');
            tempData = tempData.replace('<strong>','');
            tempData = tempData.replace('</strong>','');
            var tempData1 = tempData.split('<li>');  
            let index2=0;                      
            for (let index1 = 0; index1 < tempData1.length; index1++) {
              index2 = index2+1;
              tempData = tempData.replace('</p>','');
              tempData = tempData.replace('<ul>','');
              tempData = tempData.replace('</ul>','');
              tempData = tempData.replace('<strong>','');
              tempData = tempData.replace('</strong>','');              
              if(index2 == tempData1.length)
              {
                tempstring += tempData1[index1].replace('</li>','');
              }
              else
              {
                tempstring += tempData1[index1].replace('</li>','||');
              }
              
            }            
          }
          else{
            tempstring +=tempData;
          }                       
        }            
        addEleToDoc('tempdescriptionId', tempstring);    
      }

    });      
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};
