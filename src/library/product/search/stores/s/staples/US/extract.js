const { transform } = require('./shared');
async function implementation (
  // @ts-ignore
  inputs,
  // @ts-ignore
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('#pageItem')[index];
      originalDiv.appendChild(newDiv);
    }
    function addParentDiv (id) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const pageData = document.querySelector("body > pre[style='word-wrap: break-word; white-space: pre-wrap;']");
    // @ts-ignore
    if (pageData && pageData.innerText) {
      // @ts-ignore
      const data = (JSON.parse(pageData.innerText) && JSON.parse(pageData.innerText).products) ? JSON.parse(pageData.innerText).products : {};
      for (var index in data) {
        addParentDiv('pageItem');
        const id = (data[index].itemId) ? data[index].itemId : '';
        addHiddenDiv('ii_id', id, index);
        console.log('Id => ', id, index);

        const name = (data[index].title) ? data[index].title : '';
        addHiddenDiv('ii_name', name, index);
        console.log('name => ', name, index);

        const url = (data[index].url) ? 'https://www.staples.com' + data[index].url : '';
        addHiddenDiv('ii_url', url, index);
        console.log('url => ', url, index);

        const image = (data[index].image) ? data[index].image : '';
        addHiddenDiv('ii_image', image, index);
        console.log('image => ', image, index);

        const reviewCount = (data[index].ratingCount || data[index].ratingCount === 0) ? data[index].ratingCount : '';
        addHiddenDiv('ii_reviewCount', reviewCount, index);
        console.log(' reviewCount => ', reviewCount, index);

        const price = (data[index].price) ? data[index].price : '';
        addHiddenDiv('ii_price', price, index);
        console.log(' price => ', price, index);

        const rating = (data[index].rating || data[index].rating === 0) ? data[index].rating : '';
        addHiddenDiv('ii_rating', rating, index);
        console.log(' rating => ', rating, index);

        // addHiddenDiv('ii_searchUrl', window.location.href, index);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'staples',
    transform,
    domain: 'staples.com',
    zipcode: '',
  },
  implementation,
};
