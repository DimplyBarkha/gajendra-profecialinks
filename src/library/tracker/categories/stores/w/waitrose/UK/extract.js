
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'waitrose.com',
    store: 'waitrose',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isCookiesButtonOnPage = await context.evaluate(async () => {
      return document.querySelector('button[data-webviewid="accept-cookies"]') != null;
    });

    if (isCookiesButtonOnPage) {
      await context.click('button[data-webviewid="accept-cookies"]');
      await context.waitForNavigation();
    }

    await context.click('#site-header-browse-groceries');
    await context.waitForNavigation();

    await context.evaluate(async () => {
      function addHiddenDiv (id, content, parentDiv = null) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        if (!content) content = '';
        newDiv.textContent = content;
        if (parentDiv) {
          parentDiv.appendChild(newDiv);
        } else {
          document.body.appendChild(newDiv);
        }
        return newDiv;
      }

      function findCategories (categories, subCategorySelectors, counter = 0, names = []) {
        categories.forEach(category => {
          names[counter] = category.querySelector('span').textContent;
          if (category.querySelector('i') && counter < subCategorySelectors.length) {
            category.querySelector('a').click();
            const subCategories = document.querySelectorAll(subCategorySelectors[counter]);
            findCategories(subCategories, subCategorySelectors, counter + 1, names);
          } else {
            const newDiv = addHiddenDiv('categories');
            for (let i = 0; i <= counter; ++i) {
              addHiddenDiv('category', names[i], newDiv);
            }
            addHiddenDiv('categoryUrl', category.querySelector('a').href, newDiv);
          }
        });
      }

      const categories = document.querySelectorAll('li[role="menuitem"]');
      findCategories(categories, ['ul[data-test="mega-menu-1-list"] > li', 'ul[data-test="mega-menu-2-list"] > li']);
    });

    return await context.extract(productMenu);
  },
};
