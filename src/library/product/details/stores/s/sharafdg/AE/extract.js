const { transform } = require('../shared');

// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;

//   await context.evaluate(async function () {
//   // Accepting cookies
//     const isCookies = document.querySelector('div.cookies btn.btn-white.icon-close');
//     if (isCookies) {
//       isCookies.click();
//     }
//     const isSearchPageLink = document.querySelector('div.search-results div.product-items div.carousel-details a');
//     if (isSearchPageLink) {
//       isSearchPageLink.click();
//     }
//   });

//   return await context.extract(productDetails, { transform });
// }

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'sharafdg',
    transform,
    domain: 'sharafdg.com',
    zipcode: '',
  },
  implementation: async ({ id, URL }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    if (id) {
      await context.evaluate(function () {
        const element = document.querySelector('div.no-results-container');
        if (element) {
          throw new Error('No Results For RPC');
        }
      });
      const linkURL = await context.evaluate(function () {
        const element = document.querySelector('div.search-results div.product-items div.carousel-details a');
        if (element) {
          return `https:${element.getAttribute('href')}`;
        } else {
          return null;
        }
      });
      console.log(linkURL);
      await context.goto(linkURL, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
    }
    await context.evaluate(async function () {
    // Accepting cookies
      const isCookies = document.querySelector('div.cookies btn.btn-white.icon-close');
      if (isCookies) {
        isCookies.click();
      }
      const descTab = document.querySelector('li.prd-desc a');
      try {
        descTab.click();
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (e) {
        console.log(e);
      }
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
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
    await context.extract(productDetails, { transform: transformParam });
  },
};
