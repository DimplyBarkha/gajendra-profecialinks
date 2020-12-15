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
      for (let row of group) {
        let tmp_desc = '';
        let tmp_direction = '';

        if (row.description) {
            let info = [];
            row.description.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
            });
            if(tmp_desc != ''){
                info.push(tmp_desc);
            }
            row.description = [{'text':info.join(' || '),'xpath':row.description[0].xpath}];
        }

        if(row.ratingCount){
          let count = [];
          row.ratingCount.forEach(item => {
              count = item.text.split(" ");
          });
          row.ratingCount = [{'text': count[0],'xpath':row.ratingCount[0].xpath}];
        }

        if(row.price){
          row.price.forEach(item => {
              item.text = item.text.replace(',','.');
          });
        }

        if(row.aggregateRating){
          let rating ='';
          row.aggregateRating.forEach(item => {
            rating = item.text.replace(/,/g, '.');
          });
          row.aggregateRating = [{'text': rating,'xpath':row.aggregateRating[0].xpath}];
        }
       

        if(row.colorCode){
          let colorcodes = [];
          row.colorCode.forEach(item => {
              colorcodes = item.text.split(":")
          });
          row.colorCode = [{'text': colorcodes[1].trim(),'xpath':row.colorCode[0].xpath}];
      }
       
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };