const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    transform,
    domain: 'gigantti.fi',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const secImages = document.querySelectorAll('div[class*="slick-slide"] img');
      // let finalSecImages=[];
      for (let i = 0; i < secImages.length; i++) {
        console.log(secImages[i].getAttribute('src') + ' is secondary image');
        const tempSrc = secImages[i].getAttribute('src');
        if (tempSrc !== null && !tempSrc.includes('/tubby')) {
        // if(!secImages[i].getAttribute('src').includes('/tubby')){
          addHiddenDiv('secondaryImages', tempSrc);
        }
      }

      const overlay = document.getElementById('tab-more-info-trigger');
      if (overlay !== undefined) {
        overlay.click();
      }
    });

    await context.evaluate(async function () {
      const overlay = document.getElementById('tab-specs-trigger');
      if (overlay !== undefined) {
        overlay.click();
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
