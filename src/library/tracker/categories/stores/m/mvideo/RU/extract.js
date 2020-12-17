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

    const catalogButton = document.querySelector('div[class="header-main__catalog-btn"]');
    // @ts-ignore
    catalogButton.click();

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });

    // categories
    const mainCategories = document.querySelectorAll('a.header-catalog__category');
    mainCategories.forEach((categoryNode, index) => {
      const category = categoryNode.querySelector('div');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', categoryNode.getAttribute('href'), newCatDiv);

      // subcategories
      const subCategories = document.querySelectorAll(`div[id="header-subcategory-${index + 1}"] a.header-catalog__subcategories-block-title`);
      subCategories.forEach(subCategory => {
        if (subCategory.textContent && subCategory.getAttribute('href')) {
          const newSubCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', category.textContent, newSubCatDiv);
          addHiddenDiv('category', subCategory.textContent, newSubCatDiv);
          addHiddenDiv('categoryUrl', subCategory.getAttribute('href'), newSubCatDiv);
        }
        // subsubcategories
        const subsubCategories = subCategory.parentElement.querySelectorAll('a.header-catalog__subcategory');
        subsubCategories.forEach(subsubCategory => {
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          if (subsubCategory.textContent && subsubCategory.getAttribute('href')) {
            addHiddenDiv('category', category.textContent, newSubSubCatDiv);
            addHiddenDiv('category', subCategory.textContent, newSubSubCatDiv);
            addHiddenDiv('category', subsubCategory.textContent, newSubSubCatDiv);
            addHiddenDiv('categoryUrl', subsubCategory.getAttribute('href'), newSubSubCatDiv);
          }
        });
      });
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'RU',
    domain: 'mvideo.ru',
    store: 'mvideo',
    zipcode: '',
  },
  implementation,
};
