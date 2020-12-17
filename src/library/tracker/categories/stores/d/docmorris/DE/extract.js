
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'docmorris.de',
    store: 'docmorris',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;

    const isSiteMapPresent = await context.evaluate(async () => {
      return document.querySelector('ul[class="level-0 container-wide"]') !== null;
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

        const mainCategoryContainers = document.querySelectorAll('ul[class="level-1 container-wide"]');
        mainCategoryContainers.forEach(mainCategory => {
          console.log('MAIN-CATEGORY', mainCategory.id);
          const subCategoryContainers = mainCategory.querySelectorAll('ul');
          subCategoryContainers.forEach(subContainer => {
            const subCategory = subContainer.querySelectorAll('li:not([class])');
            subCategory.forEach(category => {
              console.log(category.textContent);
              console.log('https://www.docmorris.de/', category.querySelector('a').getAttribute('href'));
              const subWrapper = addHiddenDiv('cat-wrapper');
              const parent = addHiddenDiv('cat',' ', subWrapper );
              addHiddenDiv('category', mainCategory.id, parent);
              addHiddenDiv('category', category.textContent, parent);
              let url = category.querySelector('a').getAttribute('href');
              if (!url.includes('https://')) {
                url = 'https://www.docmorris.de' + url;
              }
              addHiddenDiv('cat-url', url, subWrapper);
            })
          })
        });
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
