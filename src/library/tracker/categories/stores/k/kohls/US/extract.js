module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'kohls.com',
    store: 'kohls',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapDivPresent = await context.evaluate(async () => {
      return document.querySelector('div#sitemap-content') !== null;
    });

    if (isSiteMapDivPresent) {
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
          'div#sitemap-content > div:not([class])',
        );
        mainCategoryContainers.forEach((mainCategory, index) => {
          if (index === mainCategoryContainers.length - 1) {
            return;
          }
          const categories = mainCategory.querySelectorAll('h3');
          categories.forEach((category) => {
            const subCategories = category.nextElementSibling
              ? category.nextElementSibling.querySelectorAll('li > a')
              : null;
            if (subCategories && subCategories.length > 0) {
              subCategories.forEach((subCategory) => {
                const subWrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv(
                  'cat',
                  mainCategory.querySelector('h2 > a')
                    ? mainCategory.querySelector('h2 > a').textContent
                    : '',
                  subWrapper,
                );
                addHiddenDiv(
                  'cat',
                  category.querySelector('h3 > a')
                    ? category.querySelector('h3 > a').textContent
                    : '',
                  subWrapper,
                );
                addHiddenDiv('cat', subCategory.textContent, subWrapper);
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
                mainCategory.querySelector('h2 > a')
                  ? mainCategory.querySelector('h2 > a').textContent
                  : '',
                wrapper,
              );
              addHiddenDiv(
                'cat',
                category.querySelector('h3 > a')
                  ? category.querySelector('h3 > a').textContent
                  : '',
                wrapper,
              );
              addHiddenDiv(
                'cat-url',
                category.querySelector('h3 > a')
                  ? category.querySelector('h3 > a').getAttribute('href')
                  : '',
                wrapper,
              );
            }
          });
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
