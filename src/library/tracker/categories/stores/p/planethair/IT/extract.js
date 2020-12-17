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
    const mainCategories = [...document.querySelectorAll('li[class*="ty-menu__item"]:not([class*="visible"])')].filter(e => e.innerText !== 'REVIEW' && e.innerText !== 'MARCHE');
    mainCategories.forEach(cat => {
      const mainCatText = cat.querySelector('.ty-menu__item-link').innerText;

      // One level menu
      if (cat.classList.contains('ty-menu__item-nodrop')) {
        const newDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', mainCatText, newDiv);
        addHiddenDiv('categoryUrl', cat.querySelector('a').getAttribute('href'), newDiv);
      }
      if (!cat.classList.contains('ty-menu__item-nodrop')) {
        const lvl2Cat = cat.querySelectorAll('.ty-menu__submenu-item-header');

        // Three level menu
        if (lvl2Cat.length !== 0) {
          lvl2Cat.forEach(lvl2 => {
            const lvl2Text = lvl2.querySelector('a').innerText;
            const lvl3Cat = lvl2.parentNode.querySelectorAll('li.ty-menu__submenu-item a');
            lvl3Cat.forEach(lvl3 => {
              const newDiv = addHiddenDiv('categories', '');
              addHiddenDiv('category', mainCatText, newDiv);
              addHiddenDiv('category', lvl2Text, newDiv);
              addHiddenDiv('category', lvl3.innerText, newDiv);
              addHiddenDiv('categoryUrl', lvl3.getAttribute('href'), newDiv);
            });
          });
        }
        // Two level menu
        if (lvl2Cat.length === 0) {
          const lvl3Cat = cat.querySelectorAll('.ty-menu__submenu-item a');
          lvl3Cat.forEach(lvl3 => {
            const newDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', mainCatText, newDiv);
            addHiddenDiv('category', lvl3.innerText, newDiv);
            addHiddenDiv('categoryUrl', lvl3.getAttribute('href'), newDiv);
          });
        }
      }
    });
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'IT',
    domain: 'planethair.it',
    store: 'planethair',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
