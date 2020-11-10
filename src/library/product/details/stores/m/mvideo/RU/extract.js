const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    transform: cleanUp,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
//   implementation: async (inputs,
//     parameters,
//     context,
//     dependencies,
//   ) => {
//     const { transform } = parameters;
//     const { productDetails } = dependencies;
//     await context.evaluate(() => {
//       function addElementToDocument (key, value) {
//         const catElement = document.createElement('div');
//         catElement.id = key;
//         catElement.textContent = value;
//         catElement.style.display = 'none';
//         document.body.appendChild(catElement);
//       }    
//       // @ts-ignore
//       var text=document.querySelector('div[class="kuName"] a').onmousedown
//       var sku=concatText.substring(concatText.indexOf('sku:')+6,concatText.indexOf('\'}'))
//       var concatText=text.toString()
//       // @ts-ignore
//       var text=document.querySelector('div[class="kuName"] a').onmousedown;
//       var concatText=text.toString();
//       var sku=concatText.substring(concatText.indexOf('sku:')+6,concatText.indexOf('\'}'));
//     });
//     return await context.extract(productDetails, { transform });
//   },
// };