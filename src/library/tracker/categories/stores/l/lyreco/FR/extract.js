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

    const mainCategories = document.querySelectorAll('ul[class*="megasubmenu"] > li');
    mainCategories.forEach(cat => {
      const mainCatText = cat.querySelector('a').innerText;
      const lvl2Cat = cat.querySelectorAll('ul[class*="first-child"] > li');

      lvl2Cat.forEach(lvl2 => {
        const lvl2Text = lvl2.querySelector('a').innerText;
        const lvl3Cat = lvl2.querySelectorAll('li');
        lvl3Cat.forEach(lvl3 => {
          const lvl3Text = lvl3.querySelector('a');
          const newDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', mainCatText, newDiv);
          addHiddenDiv('category', lvl2Text, newDiv);
          addHiddenDiv('category', lvl3Text.innerText, newDiv);
          addHiddenDiv('categoryUrl', lvl3Text.getAttribute('href'), newDiv);
        });
      });
    });
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'lyreco.com',
    store: 'lyreco',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
