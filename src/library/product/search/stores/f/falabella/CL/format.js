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
      for (let row of group) { 
        if(row.productUrl) {
            row.productUrl.forEach(item=>{
                var str = item.text.startsWith("https://www.falabella.com");
                if(str == false) {
                    item.text = "https://www.falabella.com"+item.text;
                }
            })
        }
        if(row.price) {
          row.price.forEach(item=>{
            var str = item.text;
            str = str.split(".");
            if(str.length > 2) {
              str = str.join(".");
              str = str.replace(".","");
              str = str.split(".");
              str = str.join(",");
            }
            else {
              str = str.join(",");
            }
            item.text = str;
          })
        }
        row.rank = [{ "text": rank }];
        row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };