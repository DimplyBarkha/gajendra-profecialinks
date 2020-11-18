const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    transform,
    domain: 'mediaexpert.pl',
    zipcode: '',
    noResultsXPath: null,
  },
  implementation: async (inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const productDetailsLink = await context.evaluate(function (inputs) {
      const productList = document.querySelectorAll('div.c-grid_col.is-grid-col-1');
      for (let i = 0; i < productList.length; i++) {
        const productCodeEle = productList[i].querySelector('div.is-productCode');
        if (productCodeEle) {
          const productCode = productCodeEle.textContent.trim();
          if (productCode.includes(inputs.id)) {
            const productDetailsEle = productList[i].querySelector('div.c-offerBox_photo a');
            return productDetailsEle ? productDetailsEle.getAttribute('href') : null;
          }
        }
      }
    }, inputs);
    if (productDetailsLink) {
      console.log('found product');
      const url = `https://www.mediaexpert.pl${productDetailsLink}`;
      await context.goto(url, {
        timeout: 60000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    } else {
      const noProductsFound = await context.evaluate(function (inputs) {
        const noResults = document.querySelector('div.is-noResults');
        return noResults;
      });
      if (noProductsFound) {
        throw new Error('Product not found for the given input');
      }
    }

    await context.waitForNavigation({ timeout: 60000, waitUntil: 'networkidle0' });
    await context.evaluate(async function () {
      const applyScroll = async function (context) {
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
      };
      const enhancedConent = document.querySelector('div#description label.a-toggle_label');
      if (enhancedConent) {
        // @ts-ignore
        enhancedConent.click();
        await applyScroll();
      }
    });

    // currently the selector is specific to the first video of enhanced content for RPC : 844160

    const videos = await context.evaluateInFrame('#samsung_m_01 > div > div.sam_card-365.sam_card-category-23 > div:nth-child(5) > div:nth-child(2) > iframe',
      function () {
        console.log('start of evaluate');
        const a = document.querySelector('link[rel="canonical"]');
        if (a === undefined || a === null) {
          return 'not found';
        } else {
          // return JSON.stringify(a);
          return 'came to else';
        }
      },
    );
    // console.log(JSON.stringify(videos));
    console.log('count of videos', videos);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
