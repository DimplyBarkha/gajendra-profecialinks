module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IN',
    store: 'bigbasket',
    domain: 'bigbasket.com',
    zipcode: '',
  },implementation
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    const data = window.__PRELOADED_STATE__;
    const variants = data && data.product && data.product.variants.map(e => e.id);
    variants.map(element=>{
      const newlink = document.createElement('a');
      newlink.setAttribute('class', 'variants');
      newlink.href = 'https://www.bigbasket.com/pd/'+element;
      newlink.innerHTML = element;
      document.body.appendChild(newlink);
    })
  }, createUrl);
  return await context.extract(variants);
}