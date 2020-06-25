module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    domain: 'amazon.com',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    const url = window.location.href;
    const pageNum = url.match(/\d+/g) ? url.match(/\d+/g).map(Number) : '';
    let rank = pageNum ? pageNum[0] : '';
    console.log('pageNumber: ', rank);
    const plength = document.querySelectorAll('span[cel_widget_id="MAIN-SEARCH_RESULTS"]');
    const productLength = plength ? plength.length : '';
    console.log('productLength: ', productLength);
    if (!rank || (rank === 1)) {
      rank = 0;
      // @ts-ignore
      await localStorage.setItem('rank', rank);
    } else if (rank === 1) {
      // @ts-ignore
      rank = await localStorage.getItem(productLength);
    } else if (rank > 1) {
      // @ts-ignore
      rank = await localStorage.getItem('rank');
      rank = await Number(rank);
    }
    document.querySelectorAll('span[cel_widget_id="MAIN-SEARCH_RESULTS"]').forEach(node => {
      // @ts-ignore
      ++rank;
      addHiddenDiv(node, `ii_rank_${rank}`, rank);
      addHiddenDiv(node, 'ii_url', url);
      addHiddenDiv(node, 'ii_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
      console.log('rank: ', rank);
    });
    // @ts-ignore
    await localStorage.setItem('rank', rank);
  });
  return await context.extract(productDetails);
}
