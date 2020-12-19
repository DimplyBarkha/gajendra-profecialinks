async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(() => {
    const ageCheck = document.querySelector('li.Tab-module--Tab__listItem--2XiBQ.Tab-module--Tab__listItem___inActive--34htO');
    if (ageCheck !== null) {
      ageCheck.click();
      document.querySelector('div.Cta-module--Cta--1Qymd.AgeGate-module--ageGate__confirmCTA--3dvwl').click();
    }
  });

  await context.waitForSelector('div.Header-module--Burger--3uTWL');

  await context.evaluate(() => {
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

    const mainCategories = document.querySelectorAll('div.Nav-module--NavMain--2nAv5.Nav-module--NavMain___hasActive--3SdqO>ul>li');
    mainCategories.forEach(categoryNode => {
      // subcategories
      const subCategories = categoryNode.querySelectorAll('li>a');
      subCategories.forEach(subCategory => {
        const category = categoryNode.querySelector('span');
        const newSubCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategory.textContent, newSubCatDiv);
        addHiddenDiv('categoryUrl', 'https://www.tennents.co.uk' + subCategory.getAttribute('href'), newSubCatDiv);
      });
    });
  });

  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'tennents.co.uk',
    store: 'tennents',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
