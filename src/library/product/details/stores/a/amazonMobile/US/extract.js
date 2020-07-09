const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
      const element = document.getElementById('detail-bullets');
      element && element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      const specifications = document.querySelectorAll('div[id="detail-bullets"]  ul  li ,  table[id="productDetails_techSpec"]  tbody  tr');
      const data = [];
      specifications && specifications.forEach(item => data.push(item.innerText.trim()));
      addEleToDoc('pd_spec1', data.join(''));
    });
    return await context.extract(productDetails, { transform });
  },
};
