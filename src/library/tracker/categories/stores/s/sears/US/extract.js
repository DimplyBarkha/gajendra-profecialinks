module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'US',
    domain: 'sears.com',
    store: 'sears',
    zipcode: '',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const addedCatList = document.createElement('ul');
      addedCatList.id = 'added_categories_list';
      addedCatList.style.display = 'none';
      document.body.appendChild(addedCatList);

      const allViewAllUrls = document.querySelectorAll('div#sitemap ul.list-links.column > li > a');
      for (let i = 0; i < allViewAllUrls.length; i++) {
        console.log(allViewAllUrls[i].textContent);
        const categoryUrl = allViewAllUrls[i].href;
        const doc = await fetch(categoryUrl)
          .then((resp) => resp.text())
          .then((resp) => {
            const parser = new DOMParser();
            return parser.parseFromString(resp, 'text/html');
          })
          .catch((err) => {
            console.log(err);
            throw new Error('Failed to fetch the category data');
          });
        const allCategoryUrls = document.evaluate(
          './/div[@id="sitemap"]//section//a[not(@class)]',
          doc,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        for (let j = 0; j < allCategoryUrls.snapshotLength; j++) {
          const item = allCategoryUrls.snapshotItem(j);
          const listItem = document.createElement('li');
          listItem.setAttribute('category', item.textContent);
          listItem.setAttribute('categoryUrl', item.href);
          addedCatList.appendChild(listItem);
        }
      }
    });
    await context.extract(productMenu);
  },
};
