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
      var variantCount = 0, temp_arr1 = [];
      for (let row of group) { 
            if (row.specifications) {
              var temp_arr = [];
              row.specifications.forEach(item => {
                temp_arr.push(item.text);
                //temp_arr1.push(item.text.replace('?',''));
              });
              if (temp_arr.length > 1) {
                row.specifications= [{ "text": temp_arr.join(" || "), "xpath": row.specifications[0]["xpath"] }];
                //row.description= [{ "text": temp_arr1.join(" | "), "xpath": row.specifications[0]["xpath"] }];
              } else {
                delete row.specifications;
              }
            }
            if (row.variants) {
              var temp_arr = [];
              row.variants.forEach(item => {
                item.text = item.text.replace(/.+-(\d+)/g, '$1');
                temp_arr.push(item.text);
              });
              row.firstVariant = [{ "text": row.variants[0]["text"], "xpath": row.variants[0]["xpath"] }];
              if (temp_arr.length) {
                row.variantCount = [{ "text": temp_arr.length, "xpath": row.variants[0]["xpath"] }];
                row.variants = [{ "text": temp_arr.join(' | '), "xpath": row.variants[0]["xpath"] }];
              } else {
                delete row.variants;
              }
            }
            if (row.variantInformation) {
              var temp_arr = [];
              row.variantInformation.forEach(item => {          
                temp_arr.push(item.text);
              });
              if (temp_arr.length) {
                row.variantInformation = [{ "text": temp_arr.join(' | '), "xpath": row.variantInformation[0]["xpath"] }];
              } else {
                delete row.variantInformation;
              }
            }
            if(row.description){
              let tmp='',temp_arr1=[];
              row.description.forEach(item=>{
                if(tmp==''){
                  tmp=item.text;
                }else{
                  tmp=tmp+":"+item.text;
                  temp_arr1.push(tmp);
                  tmp='';
                }
              })
              row.description=[{"text":temp_arr1.join('|')}];
            }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };