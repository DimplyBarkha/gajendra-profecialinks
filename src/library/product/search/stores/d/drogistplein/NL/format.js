/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
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
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }))));
      return data;
    };
    for (const { group } of data) {
      let rank = 1;
      for (const row of group) {
        if (row.name) {
          row.name.forEach(item => {
            item.text = item.text.replace(/\s\n/g, '').trim();
          });
        }
        if (row.reviewCount) {
            row.reviewCount.forEach(item => {
              var tmp = item.text.replace('(', '');
              item.text = tmp.replace(')', '');
              item.text=parseInt(item.text);
            });
          }
          if (row.ratingCount) {
            row.ratingCount = [{'text':row.ratingCount.length, 'xpath':row.ratingCount[0].xpath}];              
          } 
          if (row.descriptionBullets) {
            row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
          } 
        row.rank = row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };