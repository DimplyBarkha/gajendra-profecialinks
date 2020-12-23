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
    const mainCategories = document.querySelectorAll('ul.top-nav-items>li.top-header');
    mainCategories.forEach(categoryNode => {
      const category = categoryNode.querySelector('a');
      const url = categoryNode.querySelector('a') ? categoryNode.querySelector('a').getAttribute('href') : null;
      const newCatDiv = addHiddenDiv('categories', '');
      if (url !== null) {
        const link = url.startsWith('http') ? url : 'https://www.keurig.com' + url;
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', link, newCatDiv);
      }

      // subcategories
      const subCategories = categoryNode.querySelectorAll('div.exp-67 div.section');
      subCategories.forEach(subCategory => {
        const subCategoryName = subCategory.querySelector('h6:first-child') ? subCategory.querySelector('h6:first-child').textContent : null;
        const newSubCatDiv = addHiddenDiv('categories', '');
        // const url = subCategory.querySelector('a.at_subNavHeadingLink:first-child') ? subCategory.querySelector('a.at_subNavHeadingLink:first-child').getAttribute('href') : null;
        if (subCategoryName) {
          addHiddenDiv('category', category.textContent, newSubCatDiv);
          addHiddenDiv('category', subCategoryName, newSubCatDiv);
        }



        // subsubcategories
        const subsubCategories = subCategory.querySelectorAll('ul>li.sub-category>a');
        subsubCategories.forEach(subsubCategory => {
          const subsubCategoryName = subsubCategory.textContent;
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          const url = subsubCategory.getAttribute('href').startsWith('http') ? subsubCategory.getAttribute('href') : 'https://www.keurig.com' + subsubCategory.getAttribute('href');
          if (url) {
            addHiddenDiv('category', category.textContent, newSubSubCatDiv);
            addHiddenDiv('category', subCategoryName, newSubSubCatDiv);
            addHiddenDiv('category', subsubCategoryName, newSubSubCatDiv);
            addHiddenDiv('categoryUrl', url, newSubSubCatDiv);
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
    country: 'US',
    domain: 'keurig.com',
    store: 'keurig',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};