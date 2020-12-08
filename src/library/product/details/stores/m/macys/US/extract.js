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
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      let images = document.querySelectorAll('div.main-img-container ul li picture img');
      if (images.length) {
        let image = [];
        for (let i = 1; i < images.length; i++) {
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
      function stall(ms) {
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
