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
      let brandTextStr='';
      for (let row of group) {
        if(row.image){
          row.image.forEach(item => {
            item.text='https://mujbidfood.cz/'+item.text;
          });
        }
        if(row.brandText){
          row.brandText.forEach(item=>{
            brandTextStr=item.text.replace('ItemsList.aspx?brand=','');
            item.text=brandTextStr;
          })
        }
        if(row.nameExtended){
          row.nameExtended.forEach(item=>{
            item.text=brandTextStr+" - "+item.text;
          })
        }
        if(row.specifications){
          let no2=0,tmp='',inf=[];
          row.specifications.forEach(item=>{
            if(no2==0){
              no2=1;
              tmp=item.text;
            }else if(no2=1){
              tmp=tmp+" "+item.text;
              inf.push(tmp);
              no2=0;tmp='';
            }
          })
          row.specifications=[{"text":inf.join(' | ')}];
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };