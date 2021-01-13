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
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
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
    await context.evaluate(async function () {
      function addTempDiv(id, data) {
        const tempDiv = document.createElement('div');
        tempDiv.id = id;
        tempDiv.textContent = data;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
      }      //manufacturer images
      if (document.querySelectorAll('div.inpage_selector_InTheBox div.flix-background-image img')) {
        const manufacturerImages = [];
        const node = document.querySelectorAll('div.inpage_selector_InTheBox div.flix-background-image img');
        for (const i in node) {
          // @ts-ignore 
          if (node[i].srcset) {
            let data = "https:" + node[i].srcset;
            console.log("+++++++++++++++++");
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
