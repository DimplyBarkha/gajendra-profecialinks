const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    transform,
    domain: 'mifarma.es',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await context.evaluate(() => {
      const priceOutOfStock = document.querySelector('span.precio-sin-stock');
      if (priceOutOfStock) {
        let text = priceOutOfStock.innerHTML;
        console.log(text);
        text = text.replace('.', ',');
        priceOutOfStock.setAttribute('correctprice', text);
      }
    });
    await context.evaluate(() => {
      const zoom = document.querySelector('.zoomLens');

      if (zoom) {
        zoom.setAttribute('zoom', 'Yes');
      }
    });
    var data = await context.extract(productDetails, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('aggregateRating' in data[k].group[i]) {
          data[k].group[i].aggregateRating[0].text = Number(data[k].group[i].aggregateRating[0].text).toFixed(1).replace('.', ',');
        }
      }
    }
    return data;
  },
};
