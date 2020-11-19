const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    document.querySelectorAll('div.rd__rating__result').forEach(rating => {
      const width = Number(rating.getAttribute('style').match(/\d+/)[0]);
      var string = (width / 20).toString();
      string = string.replace('.', ',');
      rating.parentElement.parentElement.innerText = string;
    });
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div.rd__productinfo')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const product = document.querySelectorAll('div.rd__productinfo');
    for (let i = 0; i < product.length; i++) {
      // @ts-ignore
      const name1 = (product[i].querySelectorAll('span'))[0].textContent;
      const name2 = (product[i].querySelectorAll('span'))[1].textContent;
      const name3 = (product[i].querySelectorAll('span'))[3].textContent;
      const name4 = (product[i].querySelectorAll('span'))[2].textContent;
      const name = name1 + ' ' + name2 + ' ' + name3 + ' ' + name4;
      if (name) {
        addHiddenDiv('ii_name', name, i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    transform,
    domain: 'douglas.de',
  },
  implementation,
};
