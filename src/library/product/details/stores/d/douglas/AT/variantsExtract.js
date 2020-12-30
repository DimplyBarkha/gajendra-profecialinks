
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform: null,
    domain: 'douglas.at',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;
    try {
      await context.evaluate(async () => {
        const url = window.location.href;
        let sku = '';
        let temp = '';
        if (url.search('=') !== -1) {
        // @ts-ignore
          temp = url.split('=');
          sku = temp[temp.length - 1];
        } else {
        // @ts-ignore
          temp = url.split('/');
          sku = temp[temp.length - 1];
        }
        const res = await fetch(`https://www.douglas.at/api/v2/products/${sku}`);
        const data = await res.json();
        const variants = data.variantOptions;
        variants.forEach(variant => {
          const body = document.querySelector('body');
          const target = document.createElement('div');
          target.className = 'variants-id';
          target.innerText = variant.code;
          body.append(target);
        });
      });
    } catch (e) {
      console.log(e.message);
    }
    return await context.extract(variants, { transform });
  },
};
