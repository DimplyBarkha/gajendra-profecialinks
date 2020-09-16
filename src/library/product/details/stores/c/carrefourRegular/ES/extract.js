const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourRegular',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
      let manufactureImage = [];
      const aplusImages = document.querySelector("div[id*='inpage_container'] img") ? document.querySelectorAll("div[id*='inpage_container'] img") : null;
      for (let i = 0; i < aplusImages.length; i++) {
        if (aplusImages[i].getAttribute('data-flixsrcset')) {
          manufactureImage.push(aplusImages[i].getAttribute('data-flixsrcset'));
        }
      }
      // @ts-ignore
      manufactureImage = [...new Set(manufactureImage)];
      addHiddenDiv('ii_aplusImages', manufactureImage.join(' | '));
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
