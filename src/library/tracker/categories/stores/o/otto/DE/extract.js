
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'otto.de',
    store: 'otto',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    await context.evaluate(async () => {
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
      const categories = document.querySelectorAll('ul[class="nav_navi-list nav_navi-list--level-1 nav_navi-list--bottom-spacing"] > li:not(.nav_navi-list__separator)');

      categories.forEach((category) => {
        const categoryName = category.querySelector('a[class="nav_navi-elem nav_navi-elem--level-1 nav_navi-elem--row-1 nav_navi-elem--emphasized"], a[class="nav_navi-elem nav_navi-elem--level-1 nav_navi-elem--row-2 nav_navi-elem--emphasized"]').textContent;
        const subCategories = category.querySelectorAll('div[class="nav_level-container nav_level-container--level-2"] div[class="nav_navi-panel__body"] > ul');

        subCategories.forEach((subCategory) => {
          const subCategoryName = subCategory.querySelector('div[class="nav_navi-panel nav_navi-panel--level-2 nav_navi-panel--full-screen"] li a[class="nav_navi-elem ts-link"]').textContent;
          const elements = subCategory.querySelectorAll('a[class="nav_navi-elem ts-link"] href');

          elements.forEach((element) => {
            const newDiv = addHiddenDiv('categories');
            const names = [categoryName, subCategoryName, element.textContent];
            names.forEach(name => addHiddenDiv('category', name, newDiv));
            addHiddenDiv('categoryUrl', element.getAttribute('href'), newDiv);
          });
        });
      });
    });
    return await context.extract(productMenu);
  },
};
