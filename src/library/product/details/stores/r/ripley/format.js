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
        if(row.secondaryImageTotal){
          var tot=0;
          row.secondaryImageTotal.forEach(item=>{
            tot++;
          })
          row.secondaryImageTotal=[{"text":tot}];
        }
        if(row.variantId){
          console.log('variants');
        }else{
          row.sku.forEach(item=>{
            row.variantId=[{"text":item.text}];
          });
        }
        if(row.specifications){
          var tdNo=0; var info=[]; var tdata='';
          row.specifications.forEach(item=>{
            tdNo++;
            if(tdNo==1){
              tdata=item.text;  
            }
            if(tdNo==2){
              tdata=tdata+" : "+item.text;
              info.push(tdata);tdata='';tdNo=0;
            }
          })
          row.specifications=[{"text":info.join(" || ")}];
        }

      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };