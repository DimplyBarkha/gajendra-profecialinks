async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('#address-modal').catch(()=>{console.log('Pop-up not appeared')});
  await context.click('.container-title .btn-container i').catch(()=>{console.log('Pop-up not appeared')});
  await context.waitForSelector('.content-img img').catch(()=>{console.log('Product page not appeared')});
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'rappi_heb',
    transform: null,
    domain: 'rappi.com.mx',
    zipcode: '',
  },
  implementation,
};
