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
    let locationUrl = await context.evaluate(async () => {
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
      let manufactDes = await context.evaluate(() => {
        return document.querySelector("div[class*='tab-pane active']") ? document.querySelector("div[class*='tab-pane active']").innerText : '';
      });
      // let images =
      await context.goto(locationUrl, { timeout: 30000 });
      await context.evaluate((manufactDes) => {
        addHiddenDiv('ii_manu', manufactDes);
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
      }, manufactDes);
      return await context.extract(productDetails, { transform }, { type: 'APPEND' });
    }
    return await context.extract(productDetails, { transform });
  },
};
