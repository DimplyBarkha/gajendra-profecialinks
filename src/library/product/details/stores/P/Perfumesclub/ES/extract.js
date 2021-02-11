const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'Perfumesclub',
    transform: cleanUp,
    domain: 'perfumesclub.com',
    zipcode: '',
  },
  // implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
  //   await context.evaluate(async function () {
  //     function addElementToDocument(key, value) {
  //       const catElement = document.createElement('div');
  //       catElement.id = key;
  //       catElement.textContent = value;
  //       catElement.style.display = 'none';
  //       document.body.appendChild(catElement);
  //     }

  //     try {

  //       const directions = document.querySelectorAll('div[id="characteristics"]');
  //       let siblingsDirections = '';
  //       for (let index = 0; index < directions.length; index++) {
  //         let element = directions[index];
  //         // @ts-ignore
  //         if (element.innerText === 'EAN') {
  //           element = element.nextElementSibling;
  //           while (element) {
  //             if (element) {
  //               // @ts-ignore
  //               siblingsDirections += element.innerText;
  //               element = element.nextElementSibling;
  //             } else {
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       addElementToDocument('directions', siblingsDirections)
  //     } catch (error) {

  //     }
  //   });
  //   await context.extract(productDetails, { transform: transformParam });
  // },
};