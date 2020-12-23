
const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    transform,
    domain: 'stockmann.com',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;


    await context.evaluate(() => {
      const linkElement = document.querySelectorAll('div[class="img"]>img');
      const link = [];
      linkElement.forEach((elem) => { link.push(elem.src); });
      const idFromLink = [];
      link.forEach((elem1) => {
        idFromLink.push(elem1.replace(/(.+)(\/)(\d+)(\_\d+|)(\.jpg)/g, "$3"));
      });
      const skuElement = document.querySelectorAll('div[class="product"]');
      const skuBucket = [];
      skuElement.forEach((elem1) => {
        skuBucket.push(elem1.getAttribute('data-pid'));
      });

      const id = [];
      idFromLink.forEach((element, index) => {
        if (element.includes("jpg")) {
          id.push(skuBucket[index])
        }
        else {
          id.push(idFromLink[index])
        }
      })

      const appendDiv = document.querySelectorAll('div.product-grid div.product');
      for (let i = 0; i < appendDiv.length; i++) {
        appendDiv[i].setAttribute('skudetail', id[i]);
      }
    });

    return await context.extract(productDetails, { transform });
  },

};

