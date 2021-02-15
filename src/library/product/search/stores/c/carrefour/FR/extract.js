const { transform } = require('../FR/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.fr',
    zipcode: '',
  },
  implementation,
};
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   //--------------------------------------
//    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
//    try {
//     await context.waitForSelector('button#footer_tc_privacy_button', { timeout: 90000 });
//     let cookieBtnClicked = 0; 
//     await context.evaluate( () => {
//     // await context.evaluateInFrame('div.v-content__wrap iframe', () => {
//       let cookieButton = document.querySelector('button#footer_tc_privacy_button');
//       if (cookieButton) {
//         // @ts-ignore
//         cookieButton.click();
//         cookieBtnClicked = 1;
//       }
//     });
//     console.log('cookieBtnClicked before if: ', cookieBtnClicked);
//     if(cookieBtnClicked === 1){
//       console.log('cookieBtnClicked: ', cookieBtnClicked);
//     }
//     } catch (error) {
//       console.log('error: ', error);
//     }
//       try {
//       await context.waitForXPath('//div[@class="ab-popin_content"]', { timeout: 30000 });
//       await context.evaluateInFrame('iframe', () => {
//         let closePopUp = document.querySelector('div.ab-popin_content button.modal__close');
//         if (closePopUp) {
//           // @ts-ignore
//           closePopUp.click();
//         }
//       });
//       } catch (error) {
//         console.log('error: ', error);
//       }
//    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
//   //--------------------------------------
//   await context.evaluate(async () => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 6000));
//     }catch(error){
//       console.log(error)
//     }
//     async function infiniteScroll () {
//       let prevScroll = document.documentElement.scrollTop;
//       while (true) {
//         window.scrollBy(0, document.documentElement.clientHeight);
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         const currentScroll = document.documentElement.scrollTop;
//         if (currentScroll === prevScroll) {
//           break;
//         }
//         prevScroll = currentScroll;
//       }
//     }
//       await infiniteScroll();
//   })

//   try {
//     await new Promise((resolve) => setTimeout(resolve, 6000));
//   } catch (error) {
//     console.log('error: ', error);
    
//   }
//   return await context.extract(productDetails, { transform });
// }

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
      
      
    while (document.querySelector('div.pagination__button-wrap button')) {
      const element = document.querySelector('div.pagination__button-wrap button');
      element.scrollIntoView();
      await new Promise(resolve => setTimeout(resolve, 1500));
      // @ts-ignore
      document.querySelector('div.pagination__button-wrap button').click();
      await new Promise(resolve => setTimeout(resolve, 1500));
      let ul = document.querySelectorAll('ul#data-plp_produits');
      let finalUL ;
      if(ul){
        finalUL = ul[1];
      }
      let NoOFelementForBreak=finalUL.querySelectorAll("li.product-grid-item").length;
      
      // @ts-ignore
      if( NoOFelementForBreak=="150"){
        break;
      }
    }
  });
  try {
    await context.waitForXPath('//li[contains(@class,"product-grid-item")]');
  } catch (error) {
    console.log('All products not loaded after scrolling!!');
  }
  return await context.extract(productDetails, { transform });
}