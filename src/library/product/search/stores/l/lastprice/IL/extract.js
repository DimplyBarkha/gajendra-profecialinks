const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'lastprice',
    transform: transform,
    domain: 'lastprice.co.il',
    zipcode: '',
  },
  // implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //     function addElementToDocument (key, value) {
  //       const catElement = document.createElement('div');
  //       catElement.id = key;
  //       catElement.textContent = value;
  //       catElement.style.display = 'none';
  //       document.body.appendChild(catElement);
  //     }

  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }

  //     const getXpath = (xpath, prop) => {
  //       const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
  //       let result;
  //       if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
  //       else result = elem ? elem.singleNodeValue : '';
  //       return result && result.trim ? result.trim() : result;
  //     };

  //     const getAllXpath = (xpath, prop) => {
  //       const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //       const result = [];
  //       for (let index = 0; index < nodeSet.snapshotLength; index++) {
  //         const element = nodeSet.snapshotItem(index);
  //         if (element) result.push(prop ? element[prop] : element.nodeValue);
  //       }
  //       return result;
  //     };

      
      
  
  //   let price = getXpath("//div[@class='price']/div/div/font/font/text()", 'nodeValue');
    
  //   console.log('price   ' + price);
  //   // addElementToDocument('added_price', price);


    
    

    
  //     // playlist
  //     // addElementToDocument('added_mpc', mpc[1]);cls

     
  //     // const alternate_image_str =  getXpath("(//div[@class='container-image-and-badge  ']//picture[contains(@class, 'wp-post-image')]/source/@srcset)[1]", 'nodeValue');
  //     // if(alternate_image_str && typeof alternate_image_str == 'string'){
  //     //   const alternate_image_list = alternate_image_str.split(',');
  //     //   alternate_image_list.forEach(function(image_url_data) {
  //     //     addElementToDocument('added_alternate_image', (image_url_data.split('.webp'))[0]);   
  //     //   });       
  //     // }

      

  //     let scrollTop = 500;
  //     while (true) {
  //       window.scroll(0, scrollTop);
  //       await stall(1000);
  //       scrollTop += 500;
  //       if (scrollTop === 10000) {
  //         break;
  //       }
  //     }

  //   });
  //   await context.extract(productDetails);
  // },
};

