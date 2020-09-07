/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
    const cleanUp = text => text.toString()
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
      for (const row of group) {
        
        rankCounter += 1;
        if (!row.sponsored) {
          orgRankCounter += 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = cleanUp(el.text);
        }));
        
        // Added code as brand is not available directly on the webpage
        if(row.aggregateRating ) {
            let text = Number(row.aggregateRating[0].text).toFixed(1);
            row.aggregateRating[0].text = text;
        }
      }
    }

    context.setState({ rankCounter });
    context.setState({ orgRankCounter });

    return data;
  };
  module.exports = { transform };