const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform: transform,
    domain: 'costco.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise(resolve => setTimeout(resolve, 80000));
    await context.waitForSelector('.flix-jw', { timeout: 90000 });
    await context.evaluate(async function () {
      const arr = [];
      const videoLink = document.querySelector('.flix-jw') ? document.querySelector('.flix-jw').value.match(/file":"([^"]+)/)[1].replace(/^\\\/\\\//, '').replace(/\\\//g, '/') : '';
      if (videoLink !== '') {
        arr.push(videoLink);
      }
      const id = document.querySelector('#product-body-item-number') ? document.querySelector('#product-body-item-number').textContent.match(/(\d+)/g) : '';
      const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
      const data = await fetch(url);
      const json = await data.json();

      const array = json.widgets.widget;
      array.forEach(item => {
        const val = item.asset_id;
        const url = `https://d2vxgxvhgubbj8.cloudfront.net/videos/69/${val}_1_liveclicker.mp4`;
        arr.push(url);
      });
      let count = 0;
      arr.forEach(item => {
        document.querySelector('head').setAttribute(`vid${count}`, item);
        count++;
      });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
