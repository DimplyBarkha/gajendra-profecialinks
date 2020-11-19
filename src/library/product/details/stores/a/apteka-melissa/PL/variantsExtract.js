
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'apteka-melissa',
    transform: null,
    domain: 'apteka-melissa.pl',
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
      await context.waitForSelector('#owl-atrybuty a');
      await context.evaluate(() => {
        const body = document.querySelector('body');
        function createElement (el, text, clsName) {
          const ele = document.createElement(el);
          ele.className = clsName;
          ele.innerText = text;
          body.append(ele);
        }
        // @ts-ignore
        const urls = [...document.querySelectorAll('#owl-atrybuty a[class*="a-wariant"]')];
        const variants = [];
        urls.forEach(url => {
          variants.push(url.getAttribute('href'));
        });
        variants.forEach(variant => {
          createElement('div', variant, 'variants-url');
        });
      });
    } catch (e) {
      await context.evaluate(() => {
        const body = document.querySelector('body');
        const target = document.createElement('div');
        target.className = 'variants-url';
        target.innerText = document.querySelector('.breadcrumb > li:last-child > a').getAttribute('href');
        body.append(target);
      });
    }
    return await context.extract(variants, { transform });
  },
};
