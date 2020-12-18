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

    // category = maincategory + 7x subcategory + 49 subsubcategory

    const mainCategory = document.querySelectorAll('div[id="menu"]>ul>li');

    mainCategory.forEach(nodeCategory => {
      let category = nodeCategory.querySelector('a');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);

      // subcategories
      const subCategories = nodeCategory.querySelectorAll('ul>li:not([class])');

      subCategories.forEach(subCategory => {
        category = subCategory.querySelector('a')
        const newSubCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategory.textContent, newSubCatDiv);

        addHiddenDiv('categoryUrl', category.getAttribute('href'), newSubCatDiv);

        // subsubcategories
        const subsubCategories = subCategory.parentElement.querySelectorAll('ul>li:not([class])');
        subsubCategories.forEach(subsubCategory => {
          category = subsubCategory.querySelector('a')
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', category.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subCategory.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subsubCategory.textContent, newSubSubCatDiv);
          addHiddenDiv('categoryUrl', category.getAttribute('href'), newSubSubCatDiv);
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
