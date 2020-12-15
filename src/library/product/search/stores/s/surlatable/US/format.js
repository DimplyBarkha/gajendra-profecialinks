/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    for (const { group } of data) {
        for (const row of group) {            
            if (row.brandText) {    
               row.brandText.forEach(item => {
                var arr = item.text;
                item.text = arr.split(" ")[0]+arr.split(" ")[1];
            });
            }
            if (row.aggregateRating2) {
              row.aggregateRating2[0].text = row.aggregateRating2[0].text.replace('TTratingBox TTrating-', '').replace('-', '.');
            }
            if (row.ratingcount) {
              row.ratingcount[0].text = row.ratingcount[0].text.replace('(', '').replace(')', '');
            }
            if (row.reviewcount) {
              row.reviewcount[0].text = row.reviewcount[0].text.replace('(', '').replace(')', '');
            }

            if (row.id) {
                row.id[0].text = row.id[0].text.replace('PRO-','');
            }
        }        
    }  

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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      if (typeof el.text!=='undefined') {  
        el.text = clean(el.text);
      }
    }))));
    return data;
};  

module.exports = { transform };