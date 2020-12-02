const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  // wating for popUp

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.evaluate(() => {
    const popUp = document.querySelector('div[id="wps_popup"]');

    if (popUp !== null) {
      popUp.remove();
    }
  });

  await context.evaluate(() => {
    function addProp (selector, iterator, name, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(name, value);
    }
    const productUrl = document.querySelectorAll('.details>a');

    for (let i = 0; i < productUrl.length; i++) {
      addProp('.details>a', i, 'producturl', 'https:' + productUrl[i]);
      addProp('.details>a', i, 'rank', `${i + 1}`);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'newpharma',
    transform,
    domain: 'newpharma.nl',
    zipcode: "''",
  },
  implementation,
};
