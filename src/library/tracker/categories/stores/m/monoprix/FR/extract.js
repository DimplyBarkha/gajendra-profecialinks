async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  // const button = await context.evaluateHandle(() => document.querySelector('i.arrow'));

  await context.evaluate(async function () {
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

    const arrows = document.querySelectorAll('i.arrow');
    arrows.forEach(arrow => {
      // @ts-ignore
      arrow.click();
    });

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const secondArrows = document.querySelectorAll('div[aria-expanded="false"]>i.arrow');
    secondArrows.forEach(arrow => {
      // @ts-ignore
      arrow.click();
    });

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    // categories
    const mainCategories = document.querySelectorAll('div.sitemap-item-title');
    mainCategories.forEach((categoryNode, index) => {
      if (index < 3) {
        const categoryName = categoryNode.textContent;
        // subcategories
        const subCategories = categoryNode.parentElement.querySelectorAll('div.accordion-header.header-text-link > a');
        subCategories.forEach(subCategory => {
          const newSubCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', categoryName, newSubCatDiv);
          addHiddenDiv('category', subCategory.textContent, newSubCatDiv);
          addHiddenDiv('categoryUrl', subCategory.getAttribute('href'), newSubCatDiv);
        });
      }
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'monoprix.fr',
    store: 'monoprix',
    zipcode: '',
  },
  implementation,
};
