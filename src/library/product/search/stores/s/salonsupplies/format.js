/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
    const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '');
    
    const state = context.getState();
    let rankCounter = state.rankCounter || 0;
    for (const { group } of data) {
      for (const row of group) {
        rankCounter = rankCounter + 1;
        row.rank = [{ text: rankCounter }];
        row.rankOrganic = [{ text: rankCounter }];
        context.setState({ rankCounter });
      }
    }
    data.forEach(obj =>
      obj.group.forEach(row =>
        Object.keys(row).forEach(header =>
          row[header].forEach(el => {
            el.text = clean(el.text);
          }),
        ),
      ),
    );
  
    return data;
  };
  
  module.exports = { transform };
  