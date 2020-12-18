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
    const productList = [...document.querySelectorAll('h2.pt-3.pb-2 > a')].filter(e => e.innerText === 'CIDER AND BEER')[0].parentElement;
    const firstLevel = productList.querySelector('a').innerText;
    // @ts-ignore
    const secondLevel = [...document.querySelectorAll('div.col-12 > ul > li')].filter(e => e.innerText === 'Cider' || e.innerText === 'Beer');

    secondLevel.forEach(lvl2 => {
      const prefix = 'https://www.heineken.co.uk/';
      const lvl2Text = lvl2.innerText;
      const thirdLevel = lvl2.nextElementSibling.querySelectorAll('ul  li:not([class])');

      thirdLevel.forEach(lvl3 => {
        const lvl3Text = lvl3.innerText;
        const lvl3Link = prefix.concat(lvl3.querySelector('a').getAttribute('href'));
        const newDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', firstLevel, newDiv);
        addHiddenDiv('category', lvl2Text, newDiv);
        addHiddenDiv('category', lvl3Text, newDiv);
        addHiddenDiv('categoryUrl', lvl3Link, newDiv);
      });
    });
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'heineken.co.uk',
    store: 'heineken',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
