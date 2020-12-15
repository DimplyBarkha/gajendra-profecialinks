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

    // categories
    const mainCategories = document.querySelectorAll('div[class="top-container"] ul[class="menu side-menu"] li[class="menu-full-width "]');
    mainCategories.forEach(categoryNode => {
      const category = categoryNode.querySelector('a');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);

      // subcategories
      const subCategories = categoryNode.querySelectorAll('a[class="level1"]');
      subCategories.forEach(subCategory => {
        const newSubCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategory.textContent, newSubCatDiv);
        addHiddenDiv('categoryUrl', subCategory.getAttribute('href'), newSubCatDiv);

        // subsubcategories
        const subsubCategories = subCategory.parentElement.querySelectorAll('a[class="level2"]');
        subsubCategories.forEach(subsubCategory => {
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', category.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subCategory.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subsubCategory.textContent, newSubSubCatDiv);
          addHiddenDiv('categoryUrl', subsubCategory.getAttribute('href'), newSubSubCatDiv);
        });
      });
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'NL',
    domain: 'hulpmiddelwereld.nl',
    store: 'hulpmiddelwereld',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
