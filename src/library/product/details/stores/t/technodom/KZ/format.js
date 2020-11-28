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
      var variantCount = 0;
      for (let row of group) {              
            if (row.description) {
              row.description.forEach(item => {
                item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
                item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
              });
            }
            /*if (row.specifications) {         
              var inf = [];
              row.specifications.forEach(item => {
                inf.push(item.text);                
              });
              row.specifications=[{"text":inf.join(" || ")}];
            }*/
            if (row.specifications) {
              var temp_arr = [];
              row.specifications.forEach(item => {
                temp_arr.push(item.text);
              });
              if (temp_arr.length > 1) {
                row.specifications= [{ "text": temp_arr.join(" || "), "xpath": row.specifications[0]["xpath"] }]
              } else {
                delete row.specifications;
              }
            }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };