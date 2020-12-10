async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    let url = window.location.href;
    const splits = url ? url.split('?')[0].split('/') : [];
    url = (splits.length > 1) ? splits[splits.length - 2] : '';
    addHiddenDiv('ii_variant', url);
    const node = document.querySelector("script[id='item']");
    if (node && node.textContent) {
      const jsonObj = node.textContent.startsWith('{"item":') ? JSON.parse(node.textContent) : null;
      if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox) {
        const elements = jsonObj.item.product.buyBox.products;
        if (elements && elements.length > 0) {
          console.log(elements.length);
          for (let i = 0; i < elements.length; i++) {
            const id = elements[i].usItemId;
            if (id) {
              addHiddenDiv('ii_variant', id);
            }
          }
        }
      }
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform: null,
    domain: 'walmart.com',
    zipcode: '',
  },
  implementation,
};
