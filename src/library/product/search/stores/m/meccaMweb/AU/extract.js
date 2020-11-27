
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    transform: null,
    domain: 'mecca.com.au',
    zipcode: '',
  },
};
const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // add rank attribute
    var rank = document.querySelectorAll('div[class="product-tile"]');

    rank.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });
  });

  var data = await context.extract(productDetails, { transform });
  for (let i = 0; i < data[0].group.length; i++) {
    if ('price' in data[0].group[i]) {
      data[0].group[i].price[0].text = data[0].group[i].price[0].text.replace('.', ',');
    }
  }
  return data;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'meccaMweb',
    transform: transform,
    domain: 'mecca.com.au',
    zipcode: '',
  },
  implementation,
};
