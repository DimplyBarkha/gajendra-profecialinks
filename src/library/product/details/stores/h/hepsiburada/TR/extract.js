const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'hepsiburada',
    transform,
    domain: 'hepsiburada.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const popupButton = document.querySelector('#adultwrapper > div > div > button:nth-child(2)');
      if (popupButton) {
        document.querySelector('#adultwrapper > div > div > button:nth-child(2)').click();
      }
      const upc = window.utagData ? window.utagData.product_barcode : '';
      if (upc) {
        document.body.setAttribute('upc', upc);
      }
      const data = document.querySelector('#productDescriptionContent') ? document.querySelector('#productDescriptionContent').textContent.trim() : '';
      var bullets = JSON.stringify(data.match(/•|\*/gi) ? data.match(/•|\*/gi).length : 0);
      document.body.setAttribute('bullet_count', bullets);
      const table = document.createElement('table');
      document.body.appendChild(table);
      const tBody = document.createElement('tbody');
      table.appendChild(tBody);
      let inBoxUrl = document.querySelector("#inboxurl");
      if (inBoxUrl && inBoxUrl.textContent) {
        let inBoxUrlArr = inBoxUrl.textContent.split(',');
        for (let index = 0; index < inBoxUrlArr.length; index++) {
          const newlink = document.createElement('tr');
          newlink.setAttribute('class', 'in_boxurl');
          newlink.setAttribute('inboxurl', 'https:' + inBoxUrlArr[index]);
          tBody.appendChild(newlink);
        }
      }
      let inBoxText = document.querySelector("#inboxtext");
      if (inBoxText && inBoxText.textContent) {
        let inBoxTextArr = inBoxText.textContent.split(',');
        for (let index = 0; index < inBoxTextArr.length; index++) {
          const newlink = document.createElement('tr');
          newlink.setAttribute('class', 'in_boxtext');
          newlink.setAttribute('inboxtext', inBoxTextArr[index]);
          tBody.appendChild(newlink);
        }
      }
    });
    // Page scroll
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
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
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
