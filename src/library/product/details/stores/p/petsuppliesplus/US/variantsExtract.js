async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(() => {
    const url = window.location.href;
    const urlElement = document.createElement('div');
    urlElement.className = 'producturl';
    urlElement.setAttribute('producturl', url);
    document.body.append(urlElement);
  })
  return await context.extract(variants, { transform });
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    transform: null,
    domain: 'petsuppliesplus.com',
    zipcode: '',
  },
  implementation,
};
