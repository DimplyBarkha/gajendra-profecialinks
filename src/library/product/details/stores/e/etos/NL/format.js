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
      var rank = 1, gtinStr = '';
      for (let row of group) { 
        if(row.brandText){
            row.brandText.forEach(item => {
                var obj = JSON.parse(item.text);
                console.log('obj', obj);
                item.text = obj.brand;
                gtinStr = obj.gtin13;
            })
            row.gtin = [{"text":gtinStr}];
        }

        row.rank = [{ "text": rank }];
        row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };