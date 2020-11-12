const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform: cleanUp,
    domain: 'samsclub.com',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {

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

    await context.evaluate(() => {
      const imgAlt = document.querySelector('button[class="sc-image-viewer-img-button"] img') ? document.querySelector('button[class="sc-image-viewer-img-button"] img').alt : null;
      document.body.setAttribute('imagealt', imgAlt);
      let url = window.location.href;
      document.body.setAttribute('producturl', url);

      let results = [];
      let query = document.evaluate(`(//div[@class="sc-manufacturing-element-content"])[1]//li | (//div[@class="sc-manufacturing-element-content"])[1]//td`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      if (query) {
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          results.push(query.snapshotItem(i));
        }
      }
      let specification = '';
      for (var i = 0; i < results.length; i++) {
        specification = specification + results[i].textContent
      }

      document.body.setAttribute('specification', specification);

    });
    await context.extract(dependencies.productDetails);
  },
};
