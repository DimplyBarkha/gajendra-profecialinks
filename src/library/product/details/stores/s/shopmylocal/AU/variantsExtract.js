async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(() => {
    const scriptData = document.querySelector('script[type="application/ld+json"]') && document.querySelector('script[type="application/ld+json"]').innerText;
    const jsonData = scriptData && JSON.parse(scriptData);
    const variantUrls = jsonData && jsonData.offers && jsonData.offers.offers && jsonData.offers.offers.map(element => element && element.url);
    variantUrls.forEach((element, index) => {
      const variantDataElement = document.createElement('div');
      variantDataElement.className = 'varianturl';
      variantDataElement.setAttribute('varianturl', variantUrls[index])
      document.body.append(variantDataElement);
    })
  })
  return await context.extract(variants, { transform });
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'shopmylocal',
    transform: null,
    domain: 'shopmylocal.com.au',
    zipcode: "''",
  },
  implementation,
};
