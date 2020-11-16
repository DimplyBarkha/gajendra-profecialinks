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
  let rankCounter = state.rankCounter || 0;
  for (const { group } of data) {
    for (const row of group) {
      if (row.id) {
        row.id[0].text = row.id[0].text.match(/(.*)([a-z])(\d+)(.html)/)[3];
      }

      if (row.aggregateRating2) {
        var rating = 0;
        row.aggregateRating2.forEach(x => {
          rating += parseFloat(x.text);
        });
        row.aggregateRating2 = [{ text: (((rating / 500) * 5).toFixed(2)).replace('.', ','), xpath: '' }];
      }

      rankCounter = rankCounter + 1;
      row.rank = [{ text: rankCounter }];
      row.rankOrganic = [{ text: rankCounter }];
      context.setState({ rankCounter });
    }
  }
  return data;
};

module.exports = { transform };
