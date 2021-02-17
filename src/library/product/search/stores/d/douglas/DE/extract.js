const { transform } = require('./transform');
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
      const originalDiv = document.querySelectorAll('.product-tile__product-info')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }

    
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const product = document.querySelectorAll('.product-tile__product-info');
    for (let i = 0; i < product.length; i++) {
      // @ts-ignore
      let name1='';
      let name2='';
      let name3='';
      let name4='';
        if((product[i].querySelectorAll('div'))[0]) name1 = (product[i].querySelectorAll('div'))[0].textContent;
        if((product[i].querySelectorAll('div'))[1]) name2 = (product[i].querySelectorAll('div'))[1].textContent;
        if((product[i].querySelectorAll('div'))[3]) name3 = (product[i].querySelectorAll('div'))[3].textContent;
        if((product[i].querySelectorAll('div'))[2]) name4 = (product[i].querySelectorAll('div'))[2].textContent;
       let name = name1 + ' ' + name2 + ' ' + name3 + ' ' + name4;
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
