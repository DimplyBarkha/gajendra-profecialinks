async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(() => {
    if (document.querySelector('#consent-close')) {
      // @ts-ignore
      document.querySelector('#consent-close').click();
    }
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const scripts = document.querySelectorAll('script[type="text/javascript"]');
    // @ts-ignore
    const scriptDiv = scripts && Array.from(scripts, ele => ele.innerText);
    const pageData = scriptDiv && scriptDiv.filter(element => element.match(/(.*)pageDataObj(.*)"skus"(.*)/));
    const pageObject = pageData && pageData[0] && pageData[0].match(/(.*)pageDataObj = (.*);/) && pageData[0].replace(/(.*) = (.*);/, '$2');
    const response = pageObject && JSON.parse(pageObject);
    if (response && response.products && response.products[0] && response.products[0].skus) {
      const products = response.products[0].skus;
      products.forEach(product => {
        product.sku && addHiddenDiv('pd_sku', product.sku);
      });
    }
  });
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'labaie',
    transform: null,
    domain: 'labaie.com',
    zipcode: '',
  },
  implementation,
};
