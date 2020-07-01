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
      if (row.id && row.id[0] && productCodes.indexOf(row.id[0].text) === -1) {
        productCodes.push(row.id[0].text);
        rankCounter = rankCounter + 1;
        if (!row.sponsored) {
          orgRankCounter = orgRankCounter + 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
      } else {
        console.log(`${row.id[0].text} : ${row.name[0].text}`);
        row.id = [{ text: '' }];
      }
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
    const searchEl = document.querySelector('span.kds-Text--l');
    let searchTerms;
    if (searchEl) {
      const searchText = searchEl.textContent;
      const idx = searchText.indexOf(':');
      searchTerms = searchText.slice(idx + 2);
    }

    const url = `https://www.kroger.com/search?query=${searchTerms}&searchType=natural`;

    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = url;

    document.body.appendChild(searchUrlDiv);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform: transform,
    domain: 'kroger.com',
  },
  implementation,
};
