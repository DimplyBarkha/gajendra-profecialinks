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
    const mainCategories = document.querySelectorAll('div[id="siteNavigation"] ul li[class*="site-navigation__list-item--level-0"][data-children="true"]');
    mainCategories.forEach(categoryNode => {
      const category = categoryNode.querySelector('a');
      const url = categoryNode.querySelector('a') ? categoryNode.querySelector('a').getAttribute('href') : null;
      const newCatDiv = addHiddenDiv('categories', '');
      if (url !== null) {
        const link = url.startsWith('http') ? url : 'https://www.vikingdirect.nl/nl/' + url;
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', link, newCatDiv);
      }

      // subcategories
      const subCategories = categoryNode.querySelectorAll('ul.site-navigation__list--level-1');
      subCategories.forEach(subCategory => {
        const subCategoryName = subCategory.querySelector('li.site-navigation__list-item--level-1>a') ? subCategory.querySelector('li.site-navigation__list-item--level-1>a').textContent : null;
        const newSubCatDiv = addHiddenDiv('categories', '');
        const url = subCategory.querySelector('li.site-navigation__list-item--level-1>a') ? subCategory.querySelector('li.site-navigation__list-item--level-1>a').getAttribute('href') : null;
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategoryName, newSubCatDiv);
        if (url) {
          const link = url.startsWith('http') ? url : 'https://www.vikingdirect.nl' + url;
          addHiddenDiv('categoryUrl', link, newSubCatDiv);
        }

        // subsubcategories
        const subsubCategories = subCategory.querySelectorAll('ul.site-navigation__list--level-2 li.site-navigation__list-item--level-2>a');
        subsubCategories.forEach(subsubCategory => {
          const subsubCategoryName = subsubCategory.textContent;
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          const url = subsubCategory.getAttribute('href').startsWith('http') ? subsubCategory.getAttribute('href') : 'https://www.vikingdirect.nl' + subsubCategory.getAttribute('href');
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
    country: 'NL',
    domain: 'vikingdirect.nl',
    store: 'vikingdirect',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  }, implementation,
};
