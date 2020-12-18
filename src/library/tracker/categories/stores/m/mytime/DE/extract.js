
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'mytime.de',
    store: 'mytime',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('ul.nav-cats.nav-cats--lvl-0') !== null;
    });

    if (isSiteMapPresent) {
      await context.evaluate(async () => {
        function addHiddenDiv (id, content, parentDiv = null) {
          const newDiv = document.createElement('div');
          newDiv.dataset.id = id;
          if (!content) content = '';
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          if (parentDiv) {
            parentDiv.appendChild(newDiv);
          } else {
            document.body.appendChild(newDiv);
          }
          return newDiv;
        }

        const mainCategoryContainers = document.querySelectorAll(
          'ul.nav-cats--lvl-0  > li.nav-cats__item',
        );
        mainCategoryContainers.forEach((mainCategory, index) => {
          const categoryContainers = mainCategory.querySelectorAll(
            'ul.nav-cats--lvl-1 > li:not([class*=back])',
          );
          if (categoryContainers && categoryContainers.length > 0) {
            categoryContainers.forEach((category) => {
              const subCategories = category.querySelectorAll(
                'ul.nav-cats--lvl-2 > li:not([class*=back]) > a',
              );
              if (subCategories && subCategories.length > 0) {
                subCategories.forEach((subCategory) => {
                  const subWrapper = addHiddenDiv('cat-wrapper');
                  addHiddenDiv(
                    'cat',
                    mainCategory.querySelector('a')
                      ? mainCategory.querySelector('a').textContent
                      : '',
                    subWrapper,
                  );
                  addHiddenDiv(
                    'cat',
                    category.querySelector('a')
                      ? category.querySelector('a').textContent
                      : '',
                    subWrapper,
                  );
                  addHiddenDiv(
                    'cat',
                    subCategory.textContent,
                    subWrapper,
                  );
                  addHiddenDiv(
                    'cat-url',
                    subCategory.getAttribute('href'),
                    subWrapper,
                  );
                });
              } else {
                const wrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv(
                  'cat',
                  mainCategory.querySelector('a')
                    ? mainCategory.querySelector('a').textContent
                    : '',
                  wrapper,
                );
                addHiddenDiv(
                  'cat',
                  category.querySelector('a')
                    ? category.querySelector('a').textContent
                    : '',
                  wrapper,
                );
                addHiddenDiv(
                  'cat-url',
                  category.querySelector('a')
                    ? category.querySelector('a').getAttribute('href')
                    : '',
                  wrapper,
                );
              }
            });
          } else {
            const mainWrapper = addHiddenDiv('cat-wrapper');
            addHiddenDiv(
              'cat',
              mainCategory.querySelector('a')
                ? mainCategory.querySelector('a').textContent
                : '',
              mainWrapper,
            );
            addHiddenDiv(
              'cat-url',
              mainCategory.querySelector('a')
                ? mainCategory.querySelector('a').getAttribute('href')
                : '',
              mainWrapper,
            );
          }
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
