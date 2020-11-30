
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let terms = 'No';
    if (document.querySelector('a[href="/termos-e-condicoes"]')) {
      terms = 'Yes';
    }
    addHiddenDiv('terms', terms);

    const description =
  (document.querySelector('div.product-info-main > div.product.attribute.description > div') &&
    document.querySelector('div.product-info-main > div.product.attribute.description > div').textContent
      .split(/[\n]/)
      .join('||'));
    addHiddenDiv('description', description);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    transform: null,
    domain: 'skin.pt',
    zipcode: '',
  },
  implementation,
};
