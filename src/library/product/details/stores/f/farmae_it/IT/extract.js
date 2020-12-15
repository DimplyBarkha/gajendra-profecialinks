const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'farmae_it',
    transform: transform,
    domain: 'farmae.it',
    zipcode: '',
  },
}
  // implementation: async (inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) => {
  //   const { transform } = parameters;
  //   const { productDetails } = dependencies;
  //   const { url, id } = inputs;
  //   await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    // if (id) {
    //   await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    //   await context.waitForXPath('//div[@class="box-produto__content"]/a');
    //   await context.waitForSelector('div.box-produto__content a');
    //   console.log('everything fine !!!');
    //   await context.evaluate(() => {
    //     const firstItem = document.querySelector('div.box-produto__content a');
    //     firstItem.click();
    //   });
    // }
   
    // async function fetchManufacturerContentIframe (url) {
    //   await context.goto(url);
    //   return await context.evaluate(async function () {
    //     // const manufacturerDescription = document.body.innerText;
    //     // const manufacturerImagesList = document.querySelectorAll('');
    //     // const manufacturerImageArray = [];
    //     let gtin = '';
    //     try {
    //       const gtinPath = '//span[@class="rating"]';
    //       const gtinText = document.evaluate(gtinPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
    //       if (gtinText) gtin = gtinText;
    //     } catch (err) { }

    //     let agg = '';
    //     try {
    //       const aggPath = '//span[@class="tp-widget-summary__count"]/strong/text()';
    //       const aggText = document.evaluate(aggPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
    //       if (aggText) agg = aggText;
    //     } catch (err) { }        

    //     return { gtin, agg };
    //   });
    // }
    // async function checkmanufacturerContent () {
    //   return await context.evaluate(async function () {
    //     const manufacturerIFrameSelector = document.evaluate('//div[@class="trustpilot-widget"]/iframe[contains(text(),"Customer reviews powered by Trustpilot")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //     const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
    //     if (manufacturerIFrameSrc) {
    //       return manufacturerIFrameSrc;
    //     } else {
    //       return false;
    //     }
    //   });
    // }

    // // Function to add manufacturer content and description to DOM
    // async function addContentToDOM (manContentObj, manufacturerContentLink) {
    //   await context.evaluate(async function ([manContentObj, manufacturerContentLink]) {
    //     function addHiddenDiv (id, content) {
    //       const newDiv = document.createElement('div');
    //       newDiv.id = id;
    //       newDiv.textContent = content;
    //       newDiv.style.display = 'none';
    //       document.body.appendChild(newDiv);
    //     }
    //     if (manufacturerContentLink) {
    //       // Adding manufacturer images to DOM          
    //       addHiddenDiv('ratingCount', manContentObj.gtin);
    //       addHiddenDiv('agg', manContentObj.agg);
    //     }
    //   }, [manContentObj, manufacturerContentLink]);
    // }
    // const pageUrl = await context.evaluate(async () => {
    //   //return window.location.href;
    // });

    // console.log('pageUrl ==', pageUrl);
//     await context.evaluate(async () => {

//       async function getData () {
//         const sku = document.querySelector('meta[itemprop="sku"]').getAttribute('content');
//         const templateId = document.querySelector('div.product-summary-review-trustpilot div.trustpilot-widget').getAttribute('data-template-id');
//         const buUnitId = document.querySelector('div.product-summary-review-trustpilot div.trustpilot-widget').getAttribute('data-businessunit-id');
  
//         const url = `https://widget.trustpilot.com/trustbox-data/${templateId}?businessUnitId=${buUnitId}&locale=it-IT&sku=${sku}`;
//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         // return response.json();
//         return JSON.stringify(response.json());
//       }
//       const data = getData();
//       // const str = JSON.stringify(data);
//       return `@@@@@@@@@@@url == ${url} &&& data === ${data}`;
//     });
  
//     // const manufacturerContentLink = await checkmanufacturerContent();
//     // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ manufacturerContentLink ==', manufacturerContentLink);
//     // let manContentObj;
//     // if (manufacturerContentLink) {
//     //   manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
//     //   await context.goto(pageUrl);
//     // }
//     // console.log('manContentObj ==', manContentObj);
//     // await addContentToDOM(manContentObj, manufacturerContentLink);

//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     return await context.extract(productDetails, { transform });
//   },
// };