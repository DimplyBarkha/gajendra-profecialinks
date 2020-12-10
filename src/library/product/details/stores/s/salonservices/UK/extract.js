const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'salonservices',
    transform: transform,
    domain: 'salonservices.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addTempDiv (id, data) {
        const tempDiv = document.createElement('div');
        tempDiv.id = id;
        tempDiv.textContent = data;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
      }
      // description, bullet info and bullet counts
      const description = [];
      if (document.querySelectorAll('div[class="js-full-description hidden"] li')) {
        const node = document.querySelectorAll('div[class="js-full-description hidden"] li');
        for (const i in node) {
          // @ts-ignore
          if (node[i].textContent) description.push(node[i].textContent);
        }
        addTempDiv('mod_bulletinfo', description.join(' | '));
        addTempDiv('mod_bulletcounts', node.length);
      }
      if (document.querySelectorAll('div[itemprop="description"] ')) {
        const node = document.querySelectorAll('div[itemprop="description"] ');
        for (const i in node) {
          // @ts-ignore
          if (node[i].textContent) description.push(node[i].textContent);
        }
      }
      if (description) {
        addTempDiv('mod_desciption', description.join(' | '));
      }
      // rating
      if (document.querySelector('div[class="feefo-rating_container feefo-product_rating"]')) {
        const node = document.querySelector('div[class="feefo-rating_container feefo-product_rating"]');
        const rating = node.getAttribute('data-rating');
        const ratingf = (Number(rating) / 20).toFixed(2);
        const ratingcount = node.getAttribute('data-reviewscount');
        if (ratingf) {
          addTempDiv('mod_rating', ratingf);
        }
        addTempDiv('mod_ratingc', ratingcount);
      }
      // promotion
      if (document.querySelectorAll('style[type="text/css"]')) {
        const style = document.querySelectorAll('style[type="text/css"]');
        for (var i = 0; i < style.length; i++) {
          // @ts-ignore
          style[i].remove();
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },

};
