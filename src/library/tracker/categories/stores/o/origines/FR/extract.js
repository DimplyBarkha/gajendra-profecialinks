
async function implementation(inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv(id, content, parentDiv = null) {
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
    const mainCategories = document.querySelectorAll('ul>li[class*="level0"]~li:not([class*="mobile"])');
    mainCategories.forEach(categoryNode => {
      const category = categoryNode.querySelector('span');
      const url = categoryNode.querySelector('a#ui-id-4') ? categoryNode.querySelector('a#ui-id-4').getAttribute('href') : null;
      const newCatDiv = addHiddenDiv('categories', '');
      if (url !== null) {
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', url, newCatDiv);
      }

      // subcategories
      const subCategories = categoryNode.querySelectorAll('div.sub-menu-col>div.sub-menu-list');
      subCategories.forEach(subCategory => {
        const subCategoryName = subCategory.querySelector('div.h3-title-menu>a') ? subCategory.querySelector('div.h3-title-menu>a').textContent : null;
        const newSubCatDiv = addHiddenDiv('categories', '');
        const url = subCategory.querySelector('div.h3-title-menu>a') ? subCategory.querySelector('div.h3-title-menu>a').getAttribute('href') : null;
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategoryName, newSubCatDiv);
        if (url) {
          const link = url.startsWith('http') ? url : 'https://www.origines-parfums.com' + url;
          addHiddenDiv('categoryUrl', link, newSubCatDiv);
        }

        // subsubcategories
        const subsubCategories = subCategory.querySelectorAll('ul>li>a.ui-corner-all');
        subsubCategories.forEach(subsubCategory => {
          const subsubCategoryName = subsubCategory.querySelector('span') ? subsubCategory.querySelector('span').textContent : null;
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          const url = subsubCategory.getAttribute('href').startsWith('http') ? subsubCategory.getAttribute('href') : 'https://www.origines-parfums.com' + subsubCategory.getAttribute('href');
          addHiddenDiv('category', category.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subCategoryName, newSubSubCatDiv);
          addHiddenDiv('category', subsubCategoryName, newSubSubCatDiv);
          addHiddenDiv('categoryUrl', url, newSubSubCatDiv);

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
    domain: 'origines-parfums.com',
    store: 'origines',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
