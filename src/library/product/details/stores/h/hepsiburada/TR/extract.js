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
      try {
        const upc = window.utagData._utagData.product_barcode ? window.utagData._utagData.product_barcode : window.utagData.product_barcode;
        if (upc) {
          document.body.setAttribute('upc', upc);
        }
      } catch (error) {
        console.log('UPC data not loaded');
      }

      const data = document.querySelector('#productDescriptionContent') ? document.querySelector('#productDescriptionContent').textContent.trim() : '';
      var bullets = JSON.stringify(data.match(/•|\*/gi) ? data.match(/•|\*/gi).length : 0);
      document.body.setAttribute('bullet_count', bullets);
      const table = document.createElement('table');
      document.body.appendChild(table);
      const tBody = document.createElement('tbody');
      table.appendChild(tBody);
      const inBoxUrl = document.querySelector('#inboxurl');
      if (inBoxUrl && inBoxUrl.textContent) {
        const inBoxUrlArr = inBoxUrl.textContent.split(',');
        for (let index = 0; index < inBoxUrlArr.length; index++) {
          const newlink = document.createElement('tr');
          newlink.setAttribute('class', 'in_boxurl');
          newlink.setAttribute('inboxurl', 'https://' + inBoxUrlArr[index] + '.jpg');
          tBody.appendChild(newlink);
        }
      }
      const inBoxText = document.querySelector('#inboxtext');
      if (inBoxText && inBoxText.textContent) {
        const inBoxTextArr = inBoxText.textContent.split(',');
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
        window.scrollTo(0, 0);
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 250;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 500);
        });
      });
    };
    await applyScroll(context);
    async function getRecommended () {
      const productId = utagData.product_ids[0];
      const skuList = utagData.product_skus[0];
      const API = `https://recommendation.hepsiburada.com/api/v1/recommendations/withproductinfo?placements=item_page.web-RemovedItem&productId=${productId}&skuList=${skuList}`;
      const response = await fetch(API);
      const json = await response.json();
      const pdp = json.data.placements.map(elm => elm.products).flat().map(elm => elm.name).join('|');
      document.body.setAttribute('updp', pdp);
    }
    try {
      await context.evaluate(getRecommended);
    } catch (error) {
      console.log('Error adding domains updp', error);
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
