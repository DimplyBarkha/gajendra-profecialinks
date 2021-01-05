module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'saturn',
    transform: null,
    domain: 'saturn.de',
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
      await context.evaluate(() => {
        // @ts-ignore
        const x = window.__PRELOADED_STATE__.apolloState;
        const sku = window.location.href.replace(/(.+-)(\d+)(.htm.+)/g, '$2');
        const y = x[`GraphqlProduct:${sku}`].variants;
        let variantsId = '';
        if (y.length === 1) {
          const variants = y[0].variantProducts;
          // const allVariants = '';
          variants.forEach((variant) => {
            const body = document.querySelector('body');
            const div = document.createElement('a');
            div.className = 'variants-id';
            div.innerText = variant.productId;
            div.href = `https://www.saturn.de/de/product/-${variant.productId}.html`;
            body.append(div);
          });
        } else {
          const z = document
            .querySelector('meta[property="og:url"]')
            .getAttribute('content');
          variantsId = z.replace(/(.+-)(\d+)(.htm.+)/g, '$2');
          const body = document.querySelector('body');
          const div = document.createElement('div');
          div.className = 'variants-id';
          div.innerText = variantsId;
          body.append(div);
        }
      });
    } catch (e) {
      console.log(e.message);
    }
    return await context.extract(variants, { transform });
  },
};
