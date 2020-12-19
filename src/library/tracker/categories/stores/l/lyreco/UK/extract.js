async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.evaluate(() => {
    const popUp = document.querySelector('div[id="header-tutorial-anonymous-modal"]');
    if (popUp) {
      popUp.remove();
    }
  });

  await context.evaluate(() => {
    function addHiddenDiv (id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      if (!content) content = '';
      newDiv.textContent = content;
      // newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }

    function isAChild (parent, child) {
      if (parent && child) {
        return child.parentNode === (parent.children)[1];
      }
    }

    // category = maincategory + 7x subcategory + 49 subsubcategory

    let url;
    const mainCategory = document.querySelectorAll('div[id="menu"]>ul>li');

    mainCategory.forEach(nodeCategory => {
      const category = nodeCategory.querySelector('a');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);

      // subcategories
      const subCategoriesDiv = nodeCategory.querySelectorAll('ul>li:not([class])');
      const subCategories = [];

      subCategoriesDiv.forEach(cat => {
        if (isAChild(nodeCategory, cat)) {
          subCategories.push(cat);
        }
      });

      subCategories.forEach(subCategory => {
        const newSubCatDiv = addHiddenDiv('categories', '');
        url = subCategory.querySelector('a');
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategory.textContent, newSubCatDiv);
        addHiddenDiv('categoryUrl', url.getAttribute('href'), newSubCatDiv);

        // subsubcategories
        const subsubCategoriesDiv = subCategory.querySelectorAll('ul.pl-0>li:not([class])');
        const subsubCategories = [];

        subsubCategoriesDiv.forEach(subCat => {
          if (isAChild(subCategory, subCat)) {
            subsubCategories.push(subCat);
          }
        });

        subsubCategories.forEach(subsubCategory => {
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          url = subsubCategory.querySelector('a');
          addHiddenDiv('category', category.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subCategory.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subsubCategory.textContent, newSubSubCatDiv);
          addHiddenDiv('categoryUrl', url.getAttribute('href'), newSubSubCatDiv);
        });
      });
    });
  });
  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'lyreco.com',
    store: 'lyreco',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
