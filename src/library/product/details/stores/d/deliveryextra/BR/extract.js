const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'deliveryextra',
    transform,
    domain: 'clubeextra.com.br',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const locationUrl = await context.evaluate(async () => {
      return window.location.href;
    });
    var iframe = await context.evaluate(async () => {
      const element = document.querySelector('div#standoutDivAutomatico');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
      iframe = document.querySelector('div#standoutDivAutomatico iframe') ? document.querySelector('div#standoutDivAutomatico iframe').getAttribute('src') : null;
      iframe = 'https:' + iframe;
      return iframe;
    });
    if (iframe) {
      await context.goto(iframe);
      const manufactDes = await context.evaluate(() => {
        return document.querySelector("div[class*='tab-pane active']") ? document.querySelector("div[class*='tab-pane active']").innerText : '';
      });
      const manufactImg = await context.evaluate(() => {
        const arrImgSel = document.querySelectorAll("div[class*='box'] img[src]") ? Array.from(document.querySelectorAll("div[class*='box'] img[src]")) : '';
        const img = arrImgSel.map((imgSelector) => imgSelector && imgSelector.src ? imgSelector.src : '');
        const imgURL = img.join(' , ');
        return imgURL;
      });
      await context.goto(locationUrl, { timeout: 30000 });
      await context.evaluate((manufactDes, manufactImg) => {
        addHiddenDiv('ii_manu', manufactDes);
        addHiddenDiv('ii_img', manufactImg);
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
      }, manufactDes, manufactImg);
      return await context.extract(productDetails, { transform }, { type: 'APPEND' });
    }
    return await context.extract(productDetails, { transform });
  },
};
