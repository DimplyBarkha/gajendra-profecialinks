
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    transform: null,
    domain: 'sportsdirect.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { variants } = dependencies;
    await context.evaluate(() => {
      const isVariants = document.querySelector('ul[id="ulColourImages"]');
      if (isVariants) {
        const variantUrls = [];
        [...document.querySelectorAll('ul[id="ulColourImages"] li')].map((ele) => variantUrls.push(ele.getAttribute('data-colvarid')));
        const array = document.querySelectorAll('ul[id="ulColourImages"] li');
        for (let i = 0; i < variantUrls.length; i++) {
          const currentUrl = document.querySelector('link[rel="canonical"]').getAttribute('href');
          array[i].setAttribute('variantUrl', `${currentUrl}#colcode=${variantUrls[i]}`);
        }
      } else {
        const prodEle = document.createElement('div');
        prodEle.id = 'variants';
        prodEle.setAttribute('varianturl', document.querySelector('link[rel="canonical"]').getAttribute('href'));
        prodEle.setAttribute('variantid', document.querySelector('p.productCode').textContent.replace(/(.+:(\s+)?)(.+)/g, '$3'));
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
    });
    return await context.extract(variants);
  },
};
