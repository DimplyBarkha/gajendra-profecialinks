const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'trendyol',
    transform,
    domain: 'trendyol.com',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails, goto }) => {
    // const applyScroll = async function (context) {
    //   await context.evaluate(async function () {
    //     let scrollTop = 0;
    //     while (scrollTop !== 5000) {
    //       await stall(1000);
    //       scrollTop += 1000;
    //       window.scroll(0, scrollTop);
    //       if (scrollTop === 5000) {
    //         await stall(1000);
    //         break;
    //       }
    //     }
    //     function stall(ms) {
    //       return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //           resolve();
    //         }, ms);
    //       });
    //     }
    //   });
    // };
    // await applyScroll(context);
    const pageUrl = await context.evaluate(() => window.location.href);
    async function getECHtml () {
      const url = await context.evaluate(() => { return document.querySelector('#flix-container') ? document.querySelector('#flix-container').src : false; });
      if (url) {
        try {
          await goto({ url });
        } catch (error) {
          console.log('Ignore timeout error. Getting content');
        }
        return await context.content();
      }
      return false;
    }
    const enhancedContentHtml = await getECHtml();
    if (enhancedContentHtml) {
      await goto({ url: pageUrl });
      await context.evaluate((enhancedContentHtml) => { document.querySelector('#flix-container').parentElement.innerHTML = enhancedContentHtml; }, enhancedContentHtml);
    }
    await context.evaluate(async function () {
      function addTempDiv (id, data) {
        const tempDiv = document.createElement('div');
        tempDiv.id = id;
        tempDiv.textContent = data;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
      } // manufacturer images
      if (document.querySelectorAll('div.inpage_selector_InTheBox div.flix-background-image img')) {
        const manufacturerImages = [];
        const node = document.querySelectorAll('div.inpage_selector_InTheBox div.flix-background-image img');
        for (const i in node) {
          // @ts-ignore
          if (node[i].srcset) {
            const data = 'https:' + node[i].srcset;
            console.log('+++++++++++++++++');
            console.log(data);
            manufacturerImages.push(data);
          }
        }
        if (manufacturerImages) {
          addTempDiv('mod_1', manufacturerImages.join(' || '));
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
