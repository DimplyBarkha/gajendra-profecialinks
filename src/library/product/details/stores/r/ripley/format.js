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
        if(row.image){
          row.image.forEach(item=>{
            item.text="https:"+item.text;
          })
        }
        if(row.alternateImages){
          row.alternateImages.forEach(item=>{
            item.text="https:"+item.text;
          })
        }
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
        if(row.variants){
          var info=[];
          row.variants.forEach(item=>{
            info.push(item.text);
          })
          console.log('info leng',info.length);
          row.variants=[{"text":info.join(' | ')}];
          row.variantCount=[{"text":info.length}];
        }
        if(row.imageZoomFeaturePresent){
          row.imageZoomFeaturePresent.forEach(item=>{
            if(item.text=='zoomImg'){
              item.text='Yes';
            }
          })
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };