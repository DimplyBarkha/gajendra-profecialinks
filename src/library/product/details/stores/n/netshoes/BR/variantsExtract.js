async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('section[class="buy-box"] a[qa-automation="product-color"]')[index];
      originalDiv.appendChild(newDiv);
    }
    const node = document.querySelectorAll('section[class="buy-box"] a[qa-automation="product-color"]')
    if (node) {
      console.log("Inside node");
      for (let i = 0; i < node.length; i++) {
        const id = node[i].getAttribute("data-sku");
        addHiddenDiv('ii_variant', 'https://www.netshoes.com.br/' + id, i);
      }
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BR',
    store: 'netshoes',
    transform: null,
    domain: 'netshoes.com.br',
    zipcode: "''",
  }, implementation
};
