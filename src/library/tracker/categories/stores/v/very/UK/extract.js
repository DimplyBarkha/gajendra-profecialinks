
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'very.co.uk',
    store: 'very',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { productMenu } = dependencies;
    const isMenuPresent = await context.evaluate(async () => {
      return document.querySelector('div[id="topNav"]') !== null;
    });
    if (isMenuPresent) {
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
        const mainCategories = document.querySelectorAll('div[id="topNav"] a');
        const subCategoriesContainers = document.querySelectorAll('div[class="topNavMenu"]');
        for (let i = 0; i < mainCategories.length; i++) {
          let mainCategory = 0;
          for (let j = 0; j < subCategoriesContainers.length; j++) {
            if (subCategoriesContainers[j].id.includes(mainCategories[i].textContent.split(' ')[0])) {
              const categoryElements = subCategoriesContainers[j].querySelectorAll('h3, a');
              let main = '';
              for (let k = 0; k < categoryElements.length; k++) {
                if (!categoryElements[k].getAttribute('href')) {
                  main = categoryElements[k].textContent
                } else {
                  const subWrapper = addHiddenDiv('cat-wrapper');
                  const parent = addHiddenDiv('cat',' ', subWrapper );
                  const url = 'https://www.very.co.uk' + categoryElements[k].getAttribute('href');
                  addHiddenDiv('category', mainCategories[i].textContent, parent);
                  addHiddenDiv('category', main, parent);
                  addHiddenDiv('category', categoryElements[k].textContent, parent);
                  addHiddenDiv('cat-url', url, subWrapper);
                }
              }
            } else {
              mainCategory += 1;
            }
          }
          if (mainCategory === subCategoriesContainers.length) {
            const subWrapper = addHiddenDiv('cat-wrapper');
            const parent = addHiddenDiv('cat',' ', subWrapper );
            const url = 'https://www.very.co.uk' + mainCategories[i].getAttribute('href');
            addHiddenDiv('category', mainCategories[i].textContent, parent);
            addHiddenDiv('cat-url', url, subWrapper);
          }
        }
      });
    } else {
      throw new Error('No categories found');
    }
    return await context.extract(productMenu);
  },
};
