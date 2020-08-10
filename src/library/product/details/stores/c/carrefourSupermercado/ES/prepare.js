async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  await context.evaluate(async (zipcode) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    };
    await addHiddenDiv('ii_zipcode', zipcode);
  }, zipcode);
}
module.exports = {
  implements: 'product/details/geo/prepare',
  parameterValues: {
    country: 'ES',
    domain: 'carrefour.es',
    store: 'carrefourSupermercado',
    zipcode: '',
  },
  implementation,
};
