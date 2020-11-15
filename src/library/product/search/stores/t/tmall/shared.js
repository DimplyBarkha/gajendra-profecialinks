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
      var rank = 1;
      for (const row of group) {
        if (row.thumbnail) {
          row.thumbnail.forEach(item => {
            item.text = 'https:' + item.text
          });
        }
        
        if (row.price && row.price[0]) {
            row.price[0].text = row.price[0].text.replace(',', '.');
          }
        // if (row.aggregateRating2) {
        //   row.aggregateRating2.forEach(item => {
        //     var res = item.text.split(":");
        //     var res1 = res[1].trim();
        //     var res2 = res1.split(" ");
        //     item.text =res2[0].replace('.',',');
        //   });
        // }
        row.rank = [{ "text": rank }];
        row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    cleanUp(data);
    return data;
  };
  
  module.exports = { transform };