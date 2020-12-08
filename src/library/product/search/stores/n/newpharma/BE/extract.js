const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  // wating for popUp

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.evaluate(() => {
    const popUp = document.querySelector('div[id="wps_popup"]');
    const popUpSecond = document.querySelector('div[id="js-cookie-policy-popup"]');

    if (popUp !== null) {
      popUp.remove();
    }

    if (popUpSecond !== null) {
      popUpSecond.remove();
    }
  });

  await context.evaluate(() => {
    function addProp (selector, iterator, name, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(name, value);
    }
    const selectorRating = document.querySelectorAll('div.product.js-product-row.product--desktop');
    let rating;
    const productUrl = document.querySelectorAll('.details>a');

    for (let i = 0; i < productUrl.length; i++) {
      rating = selectorRating[i].getAttribute('data-google-360');

      rating = rating.match('"rating":"(.*?)"');
      rating = rating[1].replace('.', ',');
      addProp('.details>a', i, 'rating', rating);
      addProp('.details>a', i, 'producturl', productUrl[i]);
      addProp('.details>a', i, 'rank', `${i + 1}`);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    transform,
    domain: 'newpharma.nl',
    zipcode: "''",
  },
  implementation,
};
