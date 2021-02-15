const { transform } = require('../shared');


async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try{
    await context.waitForSelector('#amasty-shopby-product-list > div:nth-child(4) div.pages ul li.pages-item-next a.action.next[title="Successivo"]');
  } catch(e){
    console.log('Next Link selector not found')   
  }
  return await context.extract(productDetails, { transform });
}

// async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await new Promise(resolve => setTimeout(resolve, 2000));

//   try {
//     await context.waitForXPath('//script[@data-ommit="true"][contains(.,"impressions")]');
//   }
//   catch (e) {
//     console.log("error ", e);
//   }

//   await context.evaluate(async function () {
//     /*try{
//       await context.waitForSelector('li.product-item div div.product-item-photo a img.product-image-photo');
//     }
//      catch(e){
//        console.log("error is ",e);
//      }*/
//     try {
//       function addElementToDocument(doc, key, value) {
//         console.log("value is", value);
//         const catElement = document.createElement('div');
//         catElement.id = key;
//         catElement.textContent = value;
//         catElement.style.display = 'none';
//         //document.body.appendChild(catElement);
//         doc.appendChild(catElement);
//       }

//       // function addElementToDocument(key, value) {
//       //   const catElement = document.createElement('div');
//       //   catElement.id = key;
//       //   catElement.textContent = value;
//       //   catElement.style.display = 'none';
//       //   document.body.appendChild(catElement);
//       // }

//       // function to get the json data from the string
//       function findJsonData(startString, endString) {

//         const xpath = '//script[@data-ommit="true"][contains(.,"impressions")]';

//         const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         const scriptContent = element.textContent;
//         const startIdx = scriptContent.indexOf(startString);
//         const endIdx = scriptContent.indexOf(endString);
//         let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
//         jsonStr = jsonStr.trim();
//         return JSON.parse(jsonStr);

//       }
//       // elements from data Layer object

//       const dataObj = findJsonData('(', ');')
//       const data = dataObj.ecommerce.impressions;
//       console.log('data ===', JSON.stringify(dataObj));
//       // await new Promise(resolve => setTimeout(resolve, 2000));
//       const arr = document.querySelectorAll('div>ol>li.product-item');
//       for (let i = 0; i < arr.length; i++) {
//         const doc = arr[i];
//         console.log('in loop i ===', i);
//         var idInHref = document.querySelectorAll('li.product-item div div.product-item-photo a')[i].getAttribute('href');
//         var patt = /\W([\d]+).html/;
//         var realIdInArr = patt.exec(idInHref) ? patt.exec(idInHref) : 0;
//         var idNumber = realIdInArr[1] ? realIdInArr[1] : '';
//         // addElementToDocument('added-id', i);
//         if (data[i].id && data[i].id.replace('conf_', '')) {
//           console.log('With Conf');
//           addElementToDocument(doc, 'added-id', data[i].id.replace('conf_', ''));
//         }
//         //addElementToDocument(doc, 'added-id', idNumber);}
//         else {
//           if (idNumber) {
//             console.log('From URL');
//             addElementToDocument(doc, 'added-id', idNumber);
//           }

//         }

//         /*let desc = '';
//         const descSelc = doc.querySelector('div.product-item-description');
//         if (descSelc) {
//           desc = descSelc.textContent.trim();
//         }
//         const fullName = `${data[i].brand} ${data[i].name} ${desc}`;
//         console.log('in loop end $$ i ===', i);
//         addElementToDocument(doc, 'added-name', fullName.trim());*/
//       }

//       // @ts-ignore
//       //nextLink.click();    

//     }
//     catch (e) {
//       console.log("error ", e);
//     }
//   }); //, { transform }
//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    transform: transform,
    domain: ' ',
    zipcode: '',
  },
  // implementation
};
