module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'CA',
    domain: 'petsmart.ca',
    store: 'petsmart',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('div#dp-shop-by-pet') !== null;
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
          'ul[aria-label="shop by pet"] > li > a',
        );
        mainCategoryContainers.forEach((mainCategory, index) => {
          const categoryContainers = mainCategory
            .closest('section')
            .querySelectorAll('section > div')[index].querySelectorAll('ul');
          categoryContainers.forEach((category) => {
            const subCategories = category.querySelectorAll('ul > a');
            if (subCategories && subCategories.length > 0) {
              subCategories.forEach((subCategory) => {
                const subWrapper = addHiddenDiv('cat-wrapper');
                addHiddenDiv(
                  'cat',
                  mainCategory.textContent,
                  subWrapper,
                );
                addHiddenDiv(
                  'cat',
                  category.querySelector('li a')
                    ? category.querySelector('li a').textContent
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
                mainCategory.textContent,
                wrapper,
              );
              addHiddenDiv(
                'cat',
                category.querySelector('li a')
                  ? category.querySelector('li a').textContent
                  : '',
                wrapper,
              );
              addHiddenDiv(
                'cat-url',
                category.querySelector('li a')
                  ? category.querySelector('li a').getAttribute('href')
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
