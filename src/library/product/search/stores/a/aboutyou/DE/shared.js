/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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
  try {
    for (const { group } of data) {
      for (const row of group) {
        if (row.price) {
          let text = '';
          row.price.forEach(item => {
            if (item.text.match(/\b\d{5}\b/g)) {
              text = `${item.text.match(/\b\d{5}\b/g)[0].match(/^\d{3}/g)[0]}.${item.text.match(/\b\d{5}\b/g)[0].match(/\d{2}$/g)[0]}`;
            } else if (item.text.match(/\b\d{4}\b/g)) {
              text = `${item.text.match(/\b\d{4}\b/g)[0].match(/^\d{2}/g)[0]}.${item.text.match(/\b\d{4}\b/g)[0].match(/\d{2}$/g)[0]}`;
            } else if (item.text.match(/\b\d{3}\b/g)) {
              text = `${item.text.match(/\b\d{3}\b/g)[0].match(/^\d{2}/g)[0]}.${item.text.match(/\b\d{3}\b/g)[0].match(/\d{1}$/g)[0]}`;
            } else {
              text = item.text;
            }
          });
          row.price = [
            {
              text,
            },
          ];
        }
        if (row.brand) {
          row.name = [{ text: `${row.brand[0].text} ${row.name ? row.name[0].text: ''}`.trim() }]
        }

        if (row.color && row.name) {
          row.name = [{ text: `${row.name[0].text} in ${row.color[0].text}` }]
        }

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
  } catch (err) {
    console.log('Error while transforming the data' + err);
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };
