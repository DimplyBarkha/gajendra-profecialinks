
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  await context.evaluate(async () => {
    const addElementToDocument = (key, value) => {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    const url = window.location.href;
    const curentVariantId = url.match(/(\d+)-pdt.html/) ? url.match(/(\d+)-pdt.html/)[1] : null;
    // @ts-ignore
    const otherVariants = [...document.querySelectorAll('div[class="no-tablet"] li[class*=dc-product-swatch] > a')]
      .map(el => {
        return (el.href && el.href.match(/(\d+)-pdt.html/)) ? el.href.match(/(\d+)-pdt.html/)[1] : null;
      }).filter(el => !!el);
    const variantArr = [curentVariantId, ...otherVariants].filter(el => !!el);
    console.log(variantArr);
    for (let i = 0; i < variantArr.length; i++) {
      addElementToDocument('product_variant', variantArr[i]);
    }
  });
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform: null,
    domain: 'currys.co.uk',
    zipcode: "''",
  },
  implementation,
};
