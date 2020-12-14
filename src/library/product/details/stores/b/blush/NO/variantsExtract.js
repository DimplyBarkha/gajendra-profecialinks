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
    const url = window.location.href;
    const variants = document.querySelectorAll('div.product-variants__body div[class*="product-variant"] a');
    if (variants.length) {
      for (let i = 0; i < variants.length; i++) {
        const variantUrl = variants[i] ? `https://www.blush.no${variants[i].getAttribute('href')}` : '';
        addHiddenDiv('ii_variant', variantUrl);
      }
    } else addHiddenDiv('ii_variant', url);
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NO',
    store: 'blush',
    transform: null,
    domain: 'blush.no',
    zipcode: '',
  },
  implementation,
};
