async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }

    // @ts-ignore
    const productList = [...document.querySelectorAll('ul.sitemap ul > li > a')].filter(e => e.getAttribute('href') === '/products/')[0].parentElement;
    const firstLevel = productList.querySelector('a').innerText;
    const secondLevel = productList.querySelector('ul').querySelectorAll(':scope > li');

    secondLevel.forEach(lvl2 => {
      const prefix = 'https://www.matthewclark.co.uk';
      const lvl2Text = lvl2.querySelector('a').innerText;
      const thirdLevel = lvl2.querySelectorAll('ul > li');

      if (thirdLevel.length !== 0) {
        thirdLevel.forEach(lvl3 => {
          const lvl3Text = lvl3.innerText;
          const lvl3Link = prefix.concat(lvl3.querySelector('a').getAttribute('href'));
          const newDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', firstLevel, newDiv);
          addHiddenDiv('category', lvl2Text, newDiv);
          addHiddenDiv('category', lvl3Text, newDiv);
          addHiddenDiv('categoryUrl', lvl3Link, newDiv);
        });
      }
    });
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'matthewclark.co.uk',
    store: 'matthewclark',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
