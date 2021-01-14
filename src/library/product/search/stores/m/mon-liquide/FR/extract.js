async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const productUrls = document.querySelectorAll('ul.product_list li.ajax_block_product div.right-block');
    productUrls.forEach(urlNode => {
      const brand = urlNode.querySelector('.eo-productbrand').innerText;
      const link = urlNode.querySelector('.product-name').getAttribute('href');
      if (brand.toLowerCase().includes('vype') || brand.toLowerCase().includes('juul') || brand.toLowerCase().includes('blu') || link.toLowerCase().includes('logic')) {
        addHiddenDiv('my-urls', link);
      }
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'mon-liquide',
    transform: null,
    domain: 'mon-liquide.fr',
    zipcode: "''",
  },
  implementation,
};
