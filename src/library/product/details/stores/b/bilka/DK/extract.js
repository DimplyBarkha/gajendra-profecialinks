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
        
        let splitvarible=''
        if(variantArray.indexOf('<p>') !==-1)
        {
          splitvarible='<p>'
        }
        else if(variantArray.indexOf('<br>') !==-1)
        {
          splitvarible='<br>'
        }
        else{
          splitvarible='<p>'
        }        
        const variantArray1 = variantArray.split(splitvarible);  

        let tempstring='';              
        for (let index = 0; index < variantArray1.length; index++) {
          var tempData= variantArray1[index];          
            tempData = tempData.replace('</p>','');
            tempData = tempData.replace('<ul>','');
            tempData = tempData.replace('</ul>','');
            tempData = tempData.replace('<strong>','');
            tempData = tempData.replace('</strong>','');
            tempData = tempData.replace('<br>','');
            tempData = tempData.replace('</br>','');
            tempData = tempData.replace('<h3>','');
            tempData = tempData.replace('</h3>','');            
            tempData = tempData.replace('<bold>','');
            tempData = tempData.replace('</bold>',''); 
            tempData = tempData.replace('<div>','');                           
            tempData = tempData.replace('</div>','');                           
            tempData = tempData.replace('&nbsp;','');                     
          if(tempData.indexOf('<li>') !==-1)
          {
            tempData = tempData.replace('</p>','');
            tempData = tempData.replace('<ul>','');
            tempData = tempData.replace('</ul>','');
            tempData = tempData.replace('<strong>','');
            tempData = tempData.replace('</strong>','');
            tempData = tempData.replace('<br>','');
            tempData = tempData.replace('</br>','');
            tempData = tempData.replace('<h3>','');
            tempData = tempData.replace('</h3>','');            
            tempData = tempData.replace('<bold>','');
            tempData = tempData.replace('</bold>','');
            tempData = tempData.replace('<div>','');                           
            tempData = tempData.replace('</div>','');                           
            tempData = tempData.replace('&nbsp;','');
            var tempData1 = tempData.split('<li>');  
            let index2=0;                      
            for (let index1 = 0; index1 < tempData1.length; index1++) {
              index2 = index2+1;
              var tempdata4= tempData1[index1];
              tempdata4 = tempdata4.replace('</p>','');
              tempdata4 = tempdata4.replace('<ul>','');
              tempdata4 = tempdata4.replace('</ul>','');
              tempdata4 = tempdata4.replace('<strong>','');
              tempdata4 = tempdata4.replace('</strong>',''); 
              tempdata4 = tempdata4.replace('<br>','');
              tempdata4 = tempdata4.replace('</br>','');
              tempdata4 = tempdata4.replace('<h3>','');
              tempdata4 = tempdata4.replace('</h3>','');            
              tempdata4 = tempdata4.replace('<bold>','');
              tempdata4 = tempdata4.replace('</bold>','');
              tempdata4 = tempdata4.replace('<div>','');                           
              tempdata4 = tempdata4.replace('</div>','');                           
              tempdata4 = tempdata4.replace('&nbsp;','');                                     
              if(index2 == tempData1.length)
              {
                tempstring += tempdata4.replace('</li>','');
              }
              else
              {
                tempstring += tempdata4.replace('</li>',' ||');
              }              
            }            
          }
          else if(tempData.indexOf('<br>') !==-1)
            {
              alert(tempData);
              var tempData5 = tempData.split('<br>');  
              for (let index3 = 0; index3 < tempData5.length; index3++) {
              var tempdata14= tempData5[index3];
              tempdata14 = tempdata14.replace('</p>','');
              tempdata14 = tempdata14.replace('<ul>','');
              tempdata14 = tempdata14.replace('</ul>','');
              tempdata14 = tempdata14.replace('<strong>','');
              tempdata14 = tempdata14.replace('</strong>',''); 
              tempdata14 = tempdata14.replace('<br>','');
              tempdata14 = tempdata14.replace('</br>','');
              tempdata14 = tempdata14.replace('<h3>','');
              tempdata14 = tempdata14.replace('</h3>','');            
              tempdata14 = tempdata14.replace('<bold>','');
              tempdata14 = tempdata14.replace('</bold>','');                           
              tempdata14 = tempdata14.replace('<div>','');                           
              tempdata14 = tempdata14.replace('</div>','');                           
              tempdata14 = tempdata14.replace('&nbsp;','');                           
              tempstring += tempdata14;
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
