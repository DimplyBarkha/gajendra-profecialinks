const { transform } = require('../../../../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { Brands } = inputs;
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate((Brands) => {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const productUrls = document.querySelectorAll('div.product_inside');
    productUrls.forEach(urlNodeMain => {
      const ratingVal = urlNodeMain.querySelector('div.product_inside_hover span.spr-badge').getAttribute('data-rating');
      if (ratingVal > 0) {
        const urlNode = urlNodeMain.querySelector('h2.title a')
        const link = urlNode.getAttribute('href');
        if (urlNode.textContent.toLowerCase().includes(Brands.toLowerCase())) {
          addHiddenDiv('my-urls', link);
        }
      }
    });
  }, Brands);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    transform,
    domain: 'thevaporshoppeusa.com',
    zipcode: "''",
  },
  implementation,
};
