const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'macys',
    transform: cleanUp,
    domain: 'macys.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {

      if (window.__INITIAL_STATE__) {
        let id = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_id ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_id[0] : "";
        let upc = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_upc ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_upc[0] : "";
        let sku;

        if (id && upc) {
          sku = id + '_' + upc;
        } else if (!upc) {
          sku = id;
        }

        document.body.setAttribute('productsku', sku);
        document.body.setAttribute('productupc', upc);
        let product_rating = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_rating ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_rating[0] : "";
        let product_review = JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_reviews ? JSON.parse(window.__INITIAL_STATE__._PDP_BOOTSTRAP_DATA).utagData.product_reviews[0] : "";

        if (product_rating && product_review) {
          document.body.setAttribute('productrating', product_rating);
          document.body.setAttribute('productreview', product_review);
        }
      }

      let images = document.querySelectorAll('div.main-img-container ul li picture img');
      if (images.length) {
        let image = [];
        for (let i = 0; i < images.length; i++) {
          image[i] = images[i].src;
        }

        let uniqueImage = image.filter((c, index) => {
          return image.indexOf(c) === index;
        });

        const table = document.createElement('table');
        document.body.appendChild(table);
        const tBody = document.createElement('tbody');
        table.appendChild(tBody);


        for (let index = 0; index < uniqueImage.length; index++) {
          const newlink = document.createElement('tr');
          newlink.setAttribute('class', 'append_image');
          newlink.setAttribute('images', uniqueImage[index]);
          tBody.appendChild(newlink);
        }
      }
    });

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
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
