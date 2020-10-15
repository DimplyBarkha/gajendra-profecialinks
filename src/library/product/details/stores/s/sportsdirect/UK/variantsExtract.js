
// const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
  // transform
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, url, colVariants) {
      const newDiv = document.createElement('div');
      colVariants.forEach(element => {
        if (!url.includes('colcode')) {
          if (id.includes(element)) { url += '#colcode=' + id.substring(0, id.length - 3); }
        }
      });
      console.log(url + ' and id is ' + id);
      newDiv.id = id;
      newDiv.setAttribute('url', url);
      newDiv.setAttribute('class', 'variant');
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    const node = document.querySelector("ul[id='ulColourImages']");
    if (node) {
      const liNodes = document.querySelectorAll("ul[id='ulColourImages'] li a");
      const variantsCollection = document.querySelector('span[class="ProductDetailsVariants hidden"]').getAttribute('data-variants');
      const colorCollection = document.querySelector('ul[id="ulColourImages"] li').getAttribute('colvarid');
      const sizeVariants = variantsCollection.split('SizeVarId');
      const colCollection = document.querySelectorAll('ul[id="ulColourImages"] li');
      const colVariants = [];
      for (let i = 0; i < colCollection.length; i++) colVariants.push(colCollection[i].getAttribute('data-colvarid'));
      for (let i = 1; i < sizeVariants.length; i++) {
        addHiddenDiv(sizeVariants[i].substring(3, 14), window.location.href, colVariants);
      }
    }
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    transform: null,
    domain: 'sportsdirect.com',
    zipcode: '',
  },
  implementation,
};
