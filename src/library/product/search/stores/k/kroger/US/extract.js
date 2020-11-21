const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    console.log('new page!');
    const confirmButton = document.querySelector('button[data-testid="DynamicTooltip-Button-confirm"]');
    if (confirmButton) {
      confirmButton.click();
    }

    const searchEl = document.querySelector('span.kds-Text--l');
    let searchTerms;
    if (searchEl) {
      const searchText = searchEl.textContent;
      const idx = searchText.indexOf(':');
      searchTerms = searchText.slice(idx + 2);
    }

    const url = `https://www.kroger.com/search?query=${searchTerms}&searchType=natural&fulfillment=all`;
    console.log(`url before appending to the div in extract - ${url}`);

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('my-search-url', url);

    if (!document.querySelector('#page-num')) {
      addHiddenDiv('page-num', 1);
    } else {
      const pageEl = document.querySelector('#page-num');
      if (pageEl) {
        const currNum = Number(pageEl.textContent) + 1;
        pageEl.textContent = String(currNum);
      }
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform,
    domain: 'kroger.com',
  },
  implementation,
};
