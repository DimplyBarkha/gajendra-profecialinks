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

    const mainCategories = document.querySelectorAll('ul[class="frosmo-catalog__navigation"] > li[class*="nav-item"]');

    mainCategories.forEach(e => {
      const prefix = 'https://www.kauppahalli24.fi/tuotteet/#/cat/';
      // @ts-ignore
      const text = e.innerText;
      const ulList = e.querySelector('ul[class*="sub-menu"]');
      // adding category if it has no subcategories
      if (!ulList) {
        const newDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', text, newDiv);
        addHiddenDiv('categoryUrl', prefix.concat(e.querySelector('a').getAttribute('data-catid')), newDiv);
      }
      // adding category if it has subcategories
      if (ulList) {
        const listElement = e.querySelectorAll('li[data-priority] > ul[class*="sub-menu"] > li');
        listElement.forEach(el => {
          const subCatText = el.querySelector('a').innerText;
          // subcategory has no subsubcategories
          if (!el.classList.contains('expandable')) {
            const newDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', text, newDiv);
            // @ts-ignore
            addHiddenDiv('category', subCatText, newDiv);
            addHiddenDiv('categoryUrl', prefix.concat(el.querySelector('a').getAttribute('data-catid')), newDiv);
          }
          // subcategory has subsubcategories
          if (el.classList.contains('expandable')) {
            const subLinks = el.querySelectorAll('li[class="nav-item"]');
            subLinks.forEach(link => {
              const newDiv = addHiddenDiv('categories', '');
              addHiddenDiv('category', text, newDiv);
              // @ts-ignore
              addHiddenDiv('category', subCatText, newDiv);
              // @ts-ignore
              addHiddenDiv('category', link.innerText, newDiv);
              addHiddenDiv('categoryUrl', prefix.concat(link.querySelector('a').getAttribute('data-catid')), newDiv);
            });
          }
        });
      }
    });
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FI',
    domain: 'kauppahalli24.fi',
    store: 'kauppahalli24',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
