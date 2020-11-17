/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.brandText) {
                row.name[0].text = row.brandText[0].text.concat(' ', row.name[0].text);
            }

            if (row.id) {
                row.id[0].text = row.id[0].text.replace('product-','');
            }

            if (row.aggregateRating2) {
                let num = row.aggregateRating2[0].text.match(/\d+/g)[0];
                row.aggregateRating2[0].text = (num*5)/100;
            }

            if (row.reviewCount) {
                row.reviewCount[0].text = row.reviewCount[0].text.match(/\d+/g)[0];
                row.ratingCount[0].text = row.ratingCount[0].text.match(/\d+/g)[0];
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