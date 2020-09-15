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
      for (const row of group) {
        rankCounter = rankCounter + 1;
        if (!row.sponsored) {
          orgRankCounter = orgRankCounter + 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
        context.setState({ rankCounter });
        context.setState({ orgRankCounter });
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
        if (row.brandText) {
          let textB = '';
          if(row.name){
            row.name.forEach(item => {
              textB= item.text.split(" ")[0];
            });
          }
          row.brandText[0].text = textB;
        }
        // if (row.brandText) {
        //   if(row.name){
        //     row.name.forEach(item => {
             
        //     });
        //   }
        // }
        // if (row.id) {
        //   row.id.forEach(item => {
        //     item.text= item.text.split('/');
        //     let length = item.text.length;
        //     item.text = item.text[length -1];
        //   });
        // } 
      }
    }
    return data;
  };
  
  module.exports = { transform };