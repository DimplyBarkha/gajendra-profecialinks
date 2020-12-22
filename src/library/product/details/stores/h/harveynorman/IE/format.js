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
              item.text = "https:" + item.text;
          })
        }
        if(row.alternateImages){
          row.alternateImages.forEach(item=>{
              item.text = "https:" + item.text;
              var str = item.text
              str = str.replace("=150","=833");
              item.text = str.replace("=100","=555");
          })
        }
        if(row.description) {
          var arr1 = [];
          var join1 = " || ";
          row.description.forEach(item=>{
              arr1.push(item.text);
          })
          var description1 = arr1.join(" || ");
          row.description = [{"text":join1 + description1}];
        }
        if(row.price) {
          var arr2 = [];
          row.price.forEach(item=>{
              arr2.push(item.text);
          })
          row.price = [{"text":arr2.join(" ")}];
        }
        if(row.listPrice) {
          var arr3 = [];
          row.listPrice.forEach(item=>{
              arr3.push(item.text);
          })
          row.listPrice = [{"text":arr3.join(" ")}];
        }
        if(row.specifications){
          let no=0,inf=[],tmp;
          row.specifications.forEach(item=>{
            if(no==0){
              tmp=item.text;
              no=1
            }else if(no==1){
              tmp=tmp+" : "+item.text;
              inf.push(tmp);tmp='';no=0;
            }
          })
          row.specifications=[{"text":inf.join(' || ')}];
        }
        if(row.manufacturerDescription) {
          var mar1 = [];
          var joiner = " || ";
          row.manufacturerDescription.forEach(item=>{
              mar1.push(item.text);
          })
          var mdescription = mar1.join(" || ");
          row.manufacturerDescription = [{"text":joiner + mdescription}];
        }
        if(row.manufacturerImages){
          row.manufacturerImages.forEach(item=>{
              item.text = "https:" + item.text;
          })
        }
        if(row.additionalDescBulletInfo){
          let array1 = [];
          row.additionalDescBulletInfo.forEach(item=>{
            array1.push(item.text);
          })
          row.additionalDescBulletInfo = [{"text":array1.length}];
        }
        if(row.Image360Present){
          row.Image360Present=[{"text":"Yes"}];
        }         
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };