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
        if (row.nameExtended) {
            row.nameExtended.forEach(item => {
                item.text = item.text.replace(/\n/g,' ');
            });
        }
        if (row.name) {
            row.name.forEach(item => {
                item.text = item.text.replace(/\n/g,' ');
            });
        }
        if (row.price) {
            row.price.forEach(item => {
                item.text = item.text.split('/')[0].trim();
            });
        }
        if (row.quantity) {
            row.quantity.forEach(item => {
                item.text = item.text.split('/')[1].trim();
            });
        }
        // if (row.category) {
        //     let length = row.category.length;
        //     row.category= row.category[length-1]
        // }
        if (row.thumbnail) {
          row.thumbnail.forEach(item => {
           item.text = item.text.replace('/215x/','/original/')
        });
       }
       if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
            item.text = item.text.replace('.',',');
        });
       }
        if (row.productUrl) {
          row.productUrl.forEach(item => {
            if(item.text.includes('https://www.flaconi.de')){
              item.text = item.text;
            }else{
              item.text = 'https://www.flaconi.de'+item.text;
            }
        });
      }
      }
    }
    return data;
  };
  
  module.exports = { transform };