
const { transform } = require('../../../../shared');
const { implementation } = require('../extractImplementation');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(async () => {
//     while(!!document.querySelector("#container > div > div:nth-child(1) > div > main > div > div:nth-child(1) > div._2megZ9._3-XKWb > button")){
//     // @ts-ignore
//     document.querySelector("#container > div > div:nth-child(1) > div > main > div > div:nth-child(1) > div._2megZ9._3-XKWb > button").click()
//     await new Promise(r => setTimeout(r, 10000));
//     var element = document.querySelector("div.ReactVirtualized__Grid__innerScrollContainer");
//     element.scrollIntoView();
//     }
    
//     })
//   const applyScroll = async function (context) {
//   await context.evaluate(async function () {
//     let scrollTop = 0;
//     while (scrollTop !== 1000) {
//       scrollTop += 500;
//       window.scroll(0, scrollTop);
//       await stall(1000);
//     }
//     function stall(ms) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve();
//         }, ms);
//       });
//     }
//     // function addElementToDocument(key, value) {
//       const catElement = document.createElement('div');
//       catElement.id = key;
//       catElement.textContent = value;
//       catElement.style.display = 'none';
//       document.body.appendChild(catElement);
//       }
//     function addHiddenDiv(id, content, index) {
//       const newDiv = document.createElement('div');
//       newDiv.id = id;
//       newDiv.textContent = content;
//       newDiv.style.display = 'none';
//       const originalDiv = document.querySelectorAll('div.NNXRtF')[index];
//       originalDiv.parentNode.insertBefore(newDiv, originalDiv);
//     }
//     const aggregateRating = document.querySelectorAll("div.NNXRtF > div > div > div > a[data-scope-link]")
//     console.log('aggregateRating','=========================',aggregateRating.length)
//     var product_url=''
//     // const image = document.querySelectorAll("a.product-icon.align_row > div > div > img")
//     for (let k = 0; k < aggregateRating.length; k++) {
//       product_url= 'https://lyko.com'+aggregateRating[k].getAttribute("href");
//       // addElementToDocument('product_url', product_url);
//       addHiddenDiv('product_url', product_url, k);
      

//     }

//   })
  

// }
//   await applyScroll(context);
//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'lyko',
    transform: transform,
    domain: 'lyko.com',
    zipcode: '',
  },
  implementation,
};
