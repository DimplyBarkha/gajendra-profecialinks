// @ts-ignore
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
    const mainCategories = document.querySelectorAll('li[class*="navm__item Menu_Univers"],  li[class*="navm__item  navm__parent"]');

    mainCategories.forEach(cat => {
      const prefix = 'https://www.nocibe.fr';
      // @ts-ignore
      const mainCatText = cat.querySelector('a').innerText;
      const lvl2Cat = cat.querySelectorAll('div[class="navm__lvl navm__lvl-1"] > ul.navm__list > li');

      lvl2Cat.forEach(lvl2 => {
        const lvl2Text = lvl2.querySelector('a');
        if (lvl2.classList.contains('navm__parent')) {
          const lvl3Cat = lvl2.querySelectorAll('ul li:not([class*="selection"])');
          lvl3Cat.forEach(lvl3 => {
            const lvl3Text = lvl3.querySelector('a');
            const newDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', mainCatText, newDiv);
            addHiddenDiv('category', lvl2Text.textContent, newDiv);
            addHiddenDiv('category', lvl3Text.textContent, newDiv);
            addHiddenDiv('categoryUrl', prefix.concat(lvl3Text.getAttribute('href')), newDiv);
          });
        }
        if (!lvl2.classList.contains('navm__parent')) {
          const newDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', mainCatText, newDiv);
          addHiddenDiv('category', lvl2Text.textContent, newDiv);
          // @ts-ignore
          addHiddenDiv('categoryUrl', prefix.concat(lvl2Text.getAttribute('href')), newDiv);
        }
      });
    });
  });
  return await context.extract(productMenu);
}
// @ts-ignore
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'nocibe.fr',
    store: 'nocibe',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
// @ts-ignore
};// @ts-ignore
