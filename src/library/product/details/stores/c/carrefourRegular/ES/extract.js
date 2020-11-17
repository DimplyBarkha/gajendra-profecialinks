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
      const manufacturerDesc = document.querySelector('div.product-details > div.product-details__features')
        ? document.querySelector('div.product-details > div.product-details__features').innerText : '';
      if (manufacturerDesc) addHiddenDiv('manufacturerDesc', manufacturerDesc.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));
      const manufactureImage = [];
      let finalImages = [];
      const aplusImages = document.querySelector("div[id*='inpage_container'] img") ? document.querySelectorAll("div[id*='inpage_container'] img") : [];
      for (let i = 0; i < aplusImages.length; i++) {
        if (aplusImages[i].getAttribute('data-flixsrcset')) {
          manufactureImage.push(aplusImages[i].getAttribute('data-flixsrcset'));
        }
      }
      if (manufactureImage) {
        manufactureImage.forEach(item => {
          const arr = item.split(',');
          let text = arr[arr.length - 1];
          text = text.trim().split(' ') ? text.trim().split(' ')[0] : text;
          finalImages.push(text.replace(/(.*)/, 'https:$1'));
        });
      }
      // @ts-ignore
      finalImages = [...new Set(finalImages)];
      addHiddenDiv('ii_aplusImages', finalImages.join(' | '));
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
