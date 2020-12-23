async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async function () {
    const isPopupPresent = document.querySelector('button[aria-label="JEG GODTAR"]');
    // @ts-ignore
    if (isPopupPresent) isPopupPresent.click();
  });
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

    const mainCategories = document.querySelectorAll('ul[class="links content strong foldable"] > li');

    mainCategories.forEach(e => {
      // @ts-ignore
      const text = e.querySelector('a').innerText;
      const menuList = e.querySelector('div[class="sub-menu-section"]');
      // const ulList = e.nextElementSibling;
      if (menuList && menuList.childElementCount !== 0) {
        const subCat = menuList.querySelectorAll('li');
        if (subCat) {
          // @ts-ignore
          [...subCat].map(e => {
            const newDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', text, newDiv);
            addHiddenDiv('category', e.innerText, newDiv);
            addHiddenDiv('categoryUrl', e.querySelector('a').getAttribute('href'), newDiv);
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
    country: 'NO',
    domain: 'elkjop.no',
    store: 'elkjop',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
