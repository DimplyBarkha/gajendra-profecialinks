async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    var rankCounter = 1;
    const allProductDiv = document.querySelectorAll('div[data-index] > div.ProductTileFull > span > div > div > div > div');
    if (allProductDiv) {
      allProductDiv.forEach(productDiv => {
        const imgPresent = productDiv.getElementsByTagName('img')[0];
        if (imgPresent) {
          const imgSrc = imgPresent.src;
          const splitSrc = imgSrc.match(/\b\d{14}/);
          const pId = splitSrc[0];
          const pUrl = 'https://shop.gianteagle.com/harbor-creek/search/product/' + pId;
          addHiddenDiv(productDiv, 'product_url', pUrl);
          addHiddenDiv(productDiv, 'product_id', pId);
        }
        addHiddenDiv(productDiv, 'product_rank', rankCounter);
        rankCounter++;
      });
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'gianteagle',
    domain: 'gianteagle.com',
    zipcode: "'15276'",
  },
  implementation,
};
