const { transform } = require('../shared');
// async function implementation(
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.evaluate(() => {
//     const defaultNextlinkSelector = document.querySelector('head link[rel="next"]');
//     if (defaultNextlinkSelector) {
//       defaultNextlinkSelector.remove()
//     }
//   })
//   await context.evaluate(() => {
//     async function autoScroll() {
//       await new Promise((resolve, reject) => {
//         var totalHeight = 0;
//         var distance = 1000;
//         var scrollHeight = document.body.scrollHeight;
//         var timer = setInterval(() => {
//           window.scrollBy(0, distance);
//           totalHeight += distance;
//           // const clickButton = document.querySelector('button[data-test*="loadmore"]');
//           // if (clickButton) {
//           //   clickButton.click();
//           // }
//           // scrollHeight = document.body.scrollHeight;
//           if (totalHeight >= scrollHeight) {
//             clearInterval(timer);
//             resolve();
//           }
//         }, 3000);
//       });
//     }
//     autoScroll();
//   })
//   await new Promise(resolve => setTimeout(resolve, 15000));
//   try {
//     await context.waitForFunction(function (sel) {
//       return Boolean(document.querySelector(sel));
//     }, { timeout: 15000 }, 'body');
//   } catch (e) {
//     console.log('selector did not load at all')
//   }
//   try {
//     await context.waitForFunction(function (sel) {
//       return Boolean(document.querySelector(sel));
//     }, { timeout: 30000 }, 'div[data-test*="mms-search-srp-productlist-item"] picture img');
//   } catch (e) {
//     console.log('failed to load the image')
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
  // const addwaitForElement = async (element) => {
  //   try {
  //     return await context.waitForFunction(function (element) {
  //       return Boolean(element);
  //     }, { timeout: 15000 }, element);
  //   } catch (e) {
  //     console.log('selector did not load at all')
  //   }
  // }
  await context.evaluate(async () => {
    const button = document.querySelector('button[id*="accept-all"]');
    if (button) {
      // @ts-ignore
      button.click();
      console.log('cookie button clicked succesfully');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      console.log('not able to click the cookies button');
    }
  });
  // written code for custom pagination to solve the product repeatation issue
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      let scrollHeight = document.body.scrollHeight;
      while (scrollTop <= scrollHeight) {
        const clickButton = document.querySelector('button[data-test*="loadmore"]');
        if (clickButton) {
          // @ts-ignore
          clickButton.click();
        }
        scrollTop += 1000;
        console.log(`this is the current scrollTop ---- ${scrollTop}`);
        window.scroll(0, scrollTop);
        await stall(2000);
        scrollHeight = document.body.scrollHeight;
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('div[data-test*="mms-search-srp-productlist-item"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          });
        }
        const totalProductOnPage = document.querySelectorAll('div[data-test*="mms-search-srp-productlist-item"]');
        console.log('total product on the page is this number ->', totalProductOnPage.length);
        if (scrollTop > scrollHeight || totalProductOnPage.length >= 150) {
          console.log('here the loop is going to break');
          await stall(5000);
          break;
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
    const appendElements = document.querySelectorAll('div[data-test*="mms-search-srp-productlist-item"]');
    if (appendElements.length) {
      appendElements.forEach((element) => {
        if (element.getAttribute('searchurl') == null) {
          element.setAttribute('searchurl', searchUrl);
        }
      });
    }
  });

  await context.evaluate(() => {
    const defaultNextlinkSelector = document.querySelector('head link[rel="next"]');
    if (defaultNextlinkSelector) {
      defaultNextlinkSelector.remove();
    }
  });
  // await context.evaluate(async () => {
  //   let images = document.querySelectorAll('div[data-test*="mms-search-srp-productlist-item"]');
  //   for (let i = 0; i < images.length; i++) {
  //     images[i].scrollIntoView();
  //     await new Promise(resolve => setTimeout(resolve, 2000));
  //   }
  // })
  // await new Promise(resolve => setTimeout(resolve, 30000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.de',
    zipcode: '',
  },
  implementation,
};
