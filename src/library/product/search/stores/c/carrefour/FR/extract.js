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
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  //--------------------------------------
   await new Promise((resolve, reject) => setTimeout(resolve, 8000));
      try {
      await context.waitForXPath('//button[@id="footer_tc_privacy_button"]', { timeout: 30000 });
      await context.evaluateInFrame('iframe', () => {
        let cookieButton = document.querySelector('button#footer_tc_privacy_button');
        if (cookieButton) {
          // @ts-ignore
          cookieButton.click();
        }
      });
      } catch (error) {
        console.log('error: ', error);
      }
      try {
      await context.waitForXPath('//div[@class="ab-popin_content"]', { timeout: 30000 });
      await context.evaluateInFrame('iframe', () => {
        let closePopUp = document.querySelector('div.ab-popin_content button.modal__close');
        if (closePopUp) {
          // @ts-ignore
          closePopUp.click();
        }
      });
      } catch (error) {
        console.log('error: ', error);
      }
   await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //--------------------------------------
  await context.evaluate(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 6000));
    }catch(error){
      console.log(error)
    }
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
      await infiniteScroll();
  })

  try {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } catch (error) {
    console.log('error: ', error);
    
  }
  return await context.extract(productDetails, { transform });
}
