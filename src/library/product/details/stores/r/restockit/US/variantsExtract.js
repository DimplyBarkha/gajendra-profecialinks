
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'restockit',
    transform: null,
    domain: 'restockit.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    try {
      await context.waitForSelector('.magnifier-thumb-wrapper img');
      try {
        await context.waitForSelector('#variants-drop-down a');
        await context.evaluate(() => {
          // @ts-ignore
          const variants = [...document.querySelectorAll('#variants-drop-down a')];
          variants.forEach(variant => {
            const variantUrl = variant.getAttribute('href');
            const body = document.querySelector('body');
            const div = document.createElement('div');
            div.className = 'variant-url';
            div.innerText = 'https://www.restockit.com/' + variantUrl;
            body.append(div);
          });
        });
      } catch (e) {
        await context.evaluate(() => {
          const variantUrl = window.location.href;
          const body = document.querySelector('body');
          const div = document.createElement('div');
          div.className = 'variant-url';
          div.innerText = variantUrl;
          body.append(div);
        });
      }
    } catch (e) {
      throw new Error('Not a product page');
    }
    const { transform } = parameters;
    const { variants } = dependencies;
    return await context.extract(variants, { transform });
  },
};
