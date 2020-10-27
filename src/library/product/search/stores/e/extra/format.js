

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
  for (const { group } of data) {
    var rankIndex = 1;
    for (const row of group) {
      row.rankOrganic = [{ text: rankIndex, xpath: '' }];
      row.rank = [{ text: rankIndex, xpath: '' }];
      rankIndex++;
      if (row._input) {
        var text = row._input[0].text;
        row._input[0].text = String(text).replace("Você quis dizer", "").trim();
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

      if(row.aggregateRating2){
        var text = row.aggregateRating2[0].text;
        row.aggregateRating2[0].text = String(text).replace(".", ",").trim();
      }
    }
  }

  context.setState({ rankCounter });
  context.setState({ orgRankCounter });

  return data;
};

module.exports = { transform };