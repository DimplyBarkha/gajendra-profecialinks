const { transform } = require('../shared');


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'bilka',
    transform: transform,
    domain: 'bilka.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    // await context.waitForSelector('div.v-application--wrap', { timeout: 50000 });

    // await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {

      const cookieBtn = document.querySelector('button[aria-label="Accepter alle"]')
      cookieBtn.click();

      function addElementToDocument(key, value, src) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerText = value;
        catElement.setAttribute('src', src);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const url = window.location.href ? window.location.href : null;
      addElementToDocument('url', url);

      const id = url.match(/\/(\d+)\//g)[0].match(/\d+/g)[0];
      addElementToDocument('id', id);


      const isAvailable = document.querySelector('div#product-view>script')
        ? document.querySelector('div#product-view>script').innerHTML : null;
      // @ts-ignore
      if (isAvailable !== null && isAvailable.indexOf('https://schema.org/InStock') !== -1) {
        addElementToDocument('isAvailable', 'In Stock', 'Yes');
      } else if (isAvailable.indexOf('https://schema.org/OutOfStock') !== -1) {
        addElementToDocument('isAvailable', 'Out of Stock', 'No');
      } else {
        addElementToDocument('isAvailable', '', 'No');
      }
    });
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    await delay(10000);
    return await context.extract(productDetails, { transform: transformParam });

    // await context.evaluate(async () => {

    //   const url = window.location.pathname;
    //   console.log(url);
    //   const id = url.match(/\/(\d+)\//g)[0].match(/\d+/g)[0];

    //   try {
    //     const API = `https://api.sallinggroup.com/v1/ecommerce/bilka/search/pdp?id=${id}&apiKey=74470310-597f-40e7-90cd-241b5bf53483`;
    //     const response = await fetch(API);
    //     const data = await response.json();
    //     const secImageArr = data.doc.gallery_images;
    //     document.querySelector('body').setAttribute('sec-img', secImageArr.join(' | '));
    //     const gtin = data.doc.active_gtin;
    //     document.querySelector('body').setAttribute('added_gtin', gtin);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } );

    // await context.evaluate(async function () {  

    //   const url = window.location.pathname;
    //   console.log(url);
    //   const id = url.match(/\/(\d+)\//g)[0].match(/\d+/g)[0];

    //   try {
    //             const productInfo = preFetchProductDetails();          
    //             var combinepriceCurrency= productInfo['offers']['price'] + ' ' + productInfo['offers']['priceCurrency'];     
    //             //var combinepriceCurrency= productInfo['offers']['price'];     
    //               addEleToDoc('hidskuId', productInfo['sku']);
    //               addEleToDoc('hidpriceCurrency', combinepriceCurrency);      

    //               function preFetchProductDetails () {        
    //                 let productInfo = findProductDetails('//script[@type="application/ld+json" and contains(text(),"price")]');                        
    //                 productInfo = JSON.parse(productInfo.textContent);        
    //                 return productInfo;
    //               }      

    //               function findProductDetails (xpath) {        
    //                 const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;                
    //                 const productDetails = element;
    //                 return productDetails;
    //               }

    //               function addEleToDoc (key, value) {
    //                 const prodEle = document.createElement('div');
    //                 prodEle.id = key;
    //                 prodEle.textContent = value;
    //                 prodEle.style.display = 'none';
    //                 document.body.appendChild(prodEle);
    //               }
    //       } catch (error) {
    //         console.log(error.message);
    //       }

    //       const API = `https://api.sallinggroup.com/v1/ecommerce/bilka/search/pdp?id=${id}&apiKey=74470310-597f-40e7-90cd-241b5bf53483`;
    //       const response = await fetch(API);
    //       const data = await response.json();         
    //       const videos = data.doc.gallery_videos;
    //       if(videos && videos.length > 0) {
    //         for(let index = 0; index < videos.length; index++) {
    //           addEleToDoc(`video-${index + 1}`, videos[index]);
    //           console.log('added video - ' + index);
    //         }
    //       } else {
    //         console.log('no video in api');
    //       }
    //   let tempadditionalDescBulletInfo = document.querySelectorAll('div.product-panel-slot div.description').length;               
    //   if(tempadditionalDescBulletInfo > 0)
    //   {
    //     let i = 0;
    //     const nodeList = document.querySelectorAll('div.product-panel-slot div.description');   
    //     let variantArray = "";
    //     nodeList.forEach(element => {                    
    //         variantArray += `${element.innerHTML.replace(/\r\n|\r|\n/g, '')} `;
    //     });                

    //     variantArray = variantArray.replace(/<a[^>]*>|<\/a>/g,'');   
    //     variantArray = variantArray.replace(/<p[^>]*>|<\/p>/g,'');         
    //     variantArray = variantArray.replace(/<div[^>]*>|<\/div>/g,'');         
    //     variantArray = variantArray.replace(/<br[^>]*>|<\/div>/g,'');  
    //     variantArray = variantArray.replace(/<strong[^>]*>|<\/strong>/g,'');         
    //     variantArray = variantArray.replace(/<bold[^>]*>|<\/bold>/g,'');
    //     variantArray = variantArray.replace(/<ul[^>]*>|<\/ul>/g,'');
    //     variantArray = variantArray.replace(/<h3[^>]*>|<\/h3>/g,'');
    //     variantArray = variantArray.replace(/<li[^>]*>/g,''); 
    //     variantArray = variantArray.replace(/<\/li>/g,' ||');
    //     variantArray = variantArray.replace('&nbsp;','');
    //     variantArray = variantArray.replace(/&amp;nbsp;/g, '');
    //     variantArray = variantArray.replace(/\u00a0/g, '');
    //     variantArray = variantArray.replace(/&nbsp;/gi,"s");

    //     let tempindex = variantArray.lastIndexOf('||');          
    //     let tempVariantArray = variantArray.substr(0,tempindex -1); 
    //     let tempVariantArray1 = variantArray.substr(tempindex + 2,variantArray.length); 
    //     variantArray =  tempVariantArray + tempVariantArray1;        

    //     variantArray = variantArray.replace(/&amp;nbsp;/g, '');
    //     variantArray = variantArray.replace(/\s\s+/g, ' ');

    //     variantArray = variantArray.replace(/\r\n|\r|\n/g, ' ')
    //                   .replace(/&amp;nbsp;/g, ' ')
    //                   .replace(/&amp;#160/g, ' ')
    //                   .replace(/\u00A0/g, ' ')
    //                   .replace(/\s{2,}/g, ' ')
    //                   .replace(/"\s{1,}/g, '"')
    //                   .replace(/\s{1,}"/g, '"')
    //                   .replace(/^ +| +$|( )+/g, ' ')                      
    //                   .replace(/[\x00-\x1F]/g, '')
    //                   .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

    //     addEleToDoc('tempdescriptionId', variantArray);    
    //   }

    // });      
    // const delay = t => new Promise(resolve => setTimeout(resolve, t));
    // await delay(10000);
    // return await context.extract(productDetails, { transform: transformParam });
  },
};
