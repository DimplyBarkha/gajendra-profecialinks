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

    await context.evaluate(async () => {

      const url = window.location.pathname;
      console.log(url);
      const id = url.match(/\/(\d+)\//g)[0].match(/\d+/g)[0];

      try {
        const API = `https://api.sallinggroup.com/v1/ecommerce/bilka/search/pdp?id=${id}&apiKey=4456bde0-edf0-48a9-9db5-10b535e63d9c`;
        const response = await fetch(API);
        const data = await response.json();
        const secImageArr = data.doc.gallery_images;
        document.querySelector('body').setAttribute('sec-img', secImageArr.join(' | '));
      } catch (err) {
        console.log(err);
      }
    } );

    await context.evaluate(async function () {  
      
      try {
                const productInfo = preFetchProductDetails();          
                var combinepriceCurrency= productInfo['offers']['price'] + ' ' + productInfo['offers']['priceCurrency'];     
                //var combinepriceCurrency= productInfo['offers']['price'];     
                  addEleToDoc('hidskuId', productInfo['sku']);
                  addEleToDoc('hidpriceCurrency', combinepriceCurrency);      
                
                  function preFetchProductDetails () {        
                    let productInfo = findProductDetails('//script[@type="application/ld+json" and contains(text(),"price")]');                        
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
          } catch (error) {
            console.log(error.message);
          }
          let xpathforVideo = `//div[@class="thumb-container video-thumbnail"]//img[contains(@src,"youtube")]/@src`;
          let finalVideoUrl = '';
          let videoImageElm = document.evaluate(xpathforVideo, document, null, 7, null);
          if(videoImageElm.snapshotLength > 0) {
            console.log('found the element');
            if(videoImageElm.snapshotLength === 1) {
              console.log('we found exactly one link - hence will take that');
              let thisVideoUrl = videoImageElm.snapshotItem(0).textContent.trim();
              console.log('this video url is in - ' + thisVideoUrl);
              const regex = /youtube.com\/vi\/(.+)\//g;
              finalVideoUrl = 'https://www.youtube.com/watch?v=' + regex.exec(thisVideoUrl)[1];
              console.log(`final video url - ${finalVideoUrl}`);
            } else {
              console.log('multiple products with same id -- hence we do not know which one to opt for');
            }
          } else {
            console.log('element with this id is not present');
          }

          if(finalVideoUrl) {
            console.log('final video will be - ' + finalVideoUrl);
            addEleToDoc('video', finalVideoUrl);
          } else {
            console.log('final video is empty');
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
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    await delay(10000);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
