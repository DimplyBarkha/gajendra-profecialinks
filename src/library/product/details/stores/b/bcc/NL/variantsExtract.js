async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (className, content) {
      const newDiv = document.createElement('div');
      newDiv.className = className;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    let variantNodes = document.evaluate("//a[contains(@class, \"brandlogo\")]/following::div[@id=\"productvariants\"]/div[@class=\"ProductVariants__Group\"]//a/@href", document.cloneNode(true), null, 0, null); 
    if (variantNodes) {
      let node = variantNodes.iterateNext();
      while(node) {
        addHiddenDiv('ii_variant', node.value.replace(/['"]+/g, ''));
        node = variantNodes.iterateNext();
      }
    }
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    transform: null,
    domain: 'bcc.nl',
    zipcode: '',
  },
  implementation
};
