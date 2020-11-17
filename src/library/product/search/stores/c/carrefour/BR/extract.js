async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    const button = document.querySelector('button[id="onetrust-accept-btn-handler"]');
    if (button) {
      // @ts-ignore
      button.click();
      console.log('cookie button clicked succesfully');
      await new Promise((resolve) => setTimeout(resolve, 10000));
    } else {
      console.log('not able to click the cookies button');
    }
  });
  // written code for custom pagination to solve the product repeatation issue
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1500);
        scrollTop += 1000;
        console.log(`this is the current scrollTop ---- ${scrollTop}`);
        window.scroll(0, scrollTop);
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('div[class*="galleryItem"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          });
        }
        try {
          await context.waitForSelector('div[class*="imageContainer"] > img', { timeout: 50000 });
          console.log('Image loaded successfully');
        } catch (e) {
          console.log('can not load the image');
        }
        const totalProductOnPage = document.querySelectorAll('div[class*="galleryItem"]');
        console.log('total product on the page is this number ->', totalProductOnPage.length);
        if (scrollTop > 20000 || totalProductOnPage.length >= 150) {
          console.log('here the loop is going to break');
          await stall(1500);
          break;
        }
        const clickButton = document.querySelector('a[rel="next"]');
        if (clickButton) {
          // @ts-ignore
          clickButton.click();
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(() => {
    const searchUrl = window.location.href;
    const appendElements = document.querySelectorAll('div[class*="galleryItem"]');
    if (appendElements.length) {
      appendElements.forEach((element) => {
        if (element.getAttribute('searchurl') == null) {
          element.setAttribute('searchurl', searchUrl);
        }
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'carrefour',
    transform,
    zipcode: '',
    domain: 'carrefour.com.br',
  },
  implementation,
};
