async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    let url = window.location.href;
    const variantContainer = document.querySelector('div.rd__product-details__picker__list');
    console.log('came to variant')
    console.log(addHiddenDiv('ajay', "em ledu"))
    if (variantContainer) {
      console.log('variant container found')
      const variants = variantContainer.querySelectorAll('div.rd__product-details__picker__list__item');
      for (var i = 0; i < variants.length; i++) {
        variants[i].click();
        addHiddenDiv('variantUrl', window.location.href)
        console.log(window.location.href);
      }
    }

  });
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    transform: null,
    domain: 'douglas.de',
    zipcode: '',
  },
  implementation,
};
