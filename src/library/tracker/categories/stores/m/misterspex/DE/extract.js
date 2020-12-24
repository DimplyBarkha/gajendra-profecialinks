async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.evaluate(async function () {
    function addHiddenElem (className, content, elemTag = 'div', parentDiv = null) {
      const newDiv = document.createElement(elemTag);
      newDiv.className = className;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }
    
    const pageUrl = window.location.href.replace(/.$/, '');
    const catsLinks = document.querySelectorAll('#nav-wrapper>div:first-child a.ButtonRoot-sc-apcbcy, #nav-wrapper>div:first-child a.LinkRoot-sc-17sm7bh');

    catsLinks.forEach(catItem => {
      const catName = catItem.textContent;
      const catLink = catItem.getAttribute('href');
      addHiddenElem('categoryName', catName);
      addHiddenElem('categoryUrl', `${pageUrl}${catLink}`);
    });
  });
  // await context.waitForXPath(`//div[contains(@class, "idsLoop-25")]`);
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'DE',
    domain: 'misterspex.de',
    store: 'misterspex',
    zipcode: '',
  },
  implementation
};
