async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async () => {
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

    // categories
    const mainCategories = document.querySelectorAll('div.new-header-nav-bar-categories>div');
    // mainCategories.forEach(categoryNode => {
    for (let i = 0; i < mainCategories.length; i++) {
      const category = mainCategories[i].querySelector('div>a');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', 'https://www.jumbo.cl/' + category.getAttribute('href'), newCatDiv);

      // simulating hover
      mainCategories[i].addEventListener('mouseover', function () {
        console.log('Event triggered');
      });

      var event = new MouseEvent('mouseover', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
      });

      mainCategories[i].dispatchEvent(event);

      await new Promise((resolve) => setTimeout(resolve, 10000));
      // subcategories
      const subCategories = mainCategories[i].querySelectorAll('div.new-header-supermarket-dropdown-container ul>li');
      subCategories.forEach(subCategory => {
        const newSubCatDiv = addHiddenDiv('categories', '');
        const subCategoryUrl = subCategory.querySelector('a');
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategoryUrl.textContent, newSubCatDiv);
        addHiddenDiv('categoryUrl', 'https://www.jumbo.cl/' + subCategoryUrl.getAttribute('href'), newSubCatDiv);

        // subsubcategories
        const subsubCategories = subCategory.querySelectorAll('a.new-header-supermarket-dropdown-item-childrens');
        subsubCategories.forEach(subsubCategory => {
          const newSubSubCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', category.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subCategoryUrl.textContent, newSubSubCatDiv);
          addHiddenDiv('category', subsubCategory.textContent, newSubSubCatDiv);
          addHiddenDiv('categoryUrl', 'https://www.jumbo.cl/' + subsubCategory.getAttribute('href'), newSubSubCatDiv);
        });
      });
    };
  });

  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CL',
    domain: 'jumbo.cl',
    store: 'jumbo',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
