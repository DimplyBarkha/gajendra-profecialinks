const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  await context.evaluate(() => {
    function addProp(selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };
    const allProducts = document.querySelector('div#content-middle').querySelectorAll('div.product-grid-item.ColUI-gjy0oc-0.ifczFg.ViewUI-sc-1ijittn-6.iXIDWU');
    const allSponsored = document.querySelectorAll('a.card-product-url');
    let multiplier = 0;
    if (allSponsored[0]) {
      multiplier = allSponsored.length;
    };

    for (let i = 0; i < allProducts.length; i++) {
      addProp('div.RippleContainer-sc-1rpenp9-0.dMCfqq', i, 'rankorganic', `${i + 1}`);
      addProp('div.RippleContainer-sc-1rpenp9-0.dMCfqq', i, 'rank', `${i + 1 + multiplier}`);

      // if I try add id byy extract.yaml and XPATH sellector there always missing random number of ids.
      let id = document.querySelectorAll('div[class="row product-grid no-gutters main-grid"] > div > div > a')[i].href;
      id = id.match(/\/(\d+)\?/)[1];
      addProp('div.RippleContainer-sc-1rpenp9-0.dMCfqq', i, 'currentid', `${id}`);
      addProp('div.RippleContainer-sc-1rpenp9-0.dMCfqq', i, 'urldata', `https://www.submarino.com.br/produto/${id}`);
    };

    if (allSponsored[0]) {
      console.log('sponsored exists')
      for (let i = 0; i < allSponsored.length; i++) {
        const sponsoredId = allSponsored[i].href.match(/\/(\d+)\?/)[1];
        addProp('a.card-product-url', i, 'currentid', `${sponsoredId}`);
        addProp('a.card-product-url', i, 'urldata', `https://www.submarino.com.br/produto/${sponsoredId}`);
        addProp('a.card-product-url', i, 'rank', `${i + 1}`);
      }
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    transform: transform,
    domain: 'submarino.com.br',
    zipcode: '',
  },
  implementation,
};
