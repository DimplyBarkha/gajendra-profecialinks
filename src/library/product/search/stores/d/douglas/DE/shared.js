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
  for (const { group } of data) {
    for (const row of group) {
      row.name[0].text = `${row.prodTitle ? row.prodTitle[0].text : ''} ${row.prodName ? row.prodName[0].text : ''} ${row.prodCategory ? row.prodCategory[0].text : ''} ${row.prodNameExtended ? row.prodNameExtended[0].text : ''}`;
      row.name[0].text = row.name[0].text.trim()
      delete row.prodTitle;
      delete row.prodName;
      delete row.prodNameExtended;
      delete row.prodCategory
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      if (row.aggregateRating2) {
        row.aggregateRating2 = [
          {
            text: parseFloat(row.aggregateRating2[0].text).toFixed(1).replace('.', ','),
          },
        ];
      }
      if (row.thumbnail) {
        const imgStr = row.thumbnail[0].text;
        row.thumbnail = [
          {
            text: imgStr.substring(0, imgStr.lastIndexOf('?')),
          },
        ];
      }

      if (row.id) {
        const idUrl = row.id[0].text;
        row.id = [
          {
            text: idUrl.substring(idUrl.lastIndexOf('_')+1, idUrl.lastIndexOf('.')),
          },
        ];
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
  // console.log("came in here")
  // console.log(JSON.stringify(data))
  return data;
};
module.exports = { transform };
