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
      await new Promise(resolve => setTimeout(resolve, 2814));
      let element = document.getElementById('aplus');
      element = element || document.getElementById('detail-bullets');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 2197));
      }
      const specifications = document.querySelectorAll('div[id="detail-bullets"]  ul  li ,  table[id="productDetails_techSpec"]  tbody  tr');
      const data = [];
      specifications && specifications.forEach(item => data.push(item.innerText.trim()));
      addEleToDoc('pd_spec1', data.join(''));
    });
    return await context.extract(productDetails, { transform });
  },
};
