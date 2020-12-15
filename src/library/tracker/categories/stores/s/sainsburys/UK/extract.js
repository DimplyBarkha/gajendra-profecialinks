module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'sainsburys.co.uk',
    store: 'sainsburys',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await context.evaluate(async () => {
      const dataDestUrl = document.querySelector('form[data-action="search"][data-destination]')
        ? document.querySelector('form[data-action="search"][data-destination]').getAttribute('data-destination')
        : null;
      const storeId = dataDestUrl && dataDestUrl.match(/storeId=(.+?)&/) ? dataDestUrl.match(/storeId=(.+?)&/)[1] : '';

      const navList = await fetch(
        `https://www.sainsburys.co.uk/shop/AjaxGetImmutableZDASView?requesttype=ajax&storeId=${storeId}`,
      )
        .then((resp) => resp.json())
        .then((resp) => resp.navList)
        .catch((err) => {
          console.log(err);
          throw new Error('Failed to fetch the categories object.');
        });

      const addedCatList = document.createElement('ul');
      addedCatList.id = 'added_categories_list';
      addedCatList.style.display = 'none';
      document.body.appendChild(addedCatList);

      const htmlDecode = (input) => {
        var doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent;
      };

      navList.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('category', htmlDecode(item.name));
        const url = item.itemUrl.startsWith('https://www.sainsburys.co.uk') ? item.itemUrl : `https://www.sainsburys.co.uk${item.itemUrl}`;
        listItem.setAttribute('categoryUrl', url);
        addedCatList.appendChild(listItem);
      });
    });

    await context.extract(productMenu);
  },
};
