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
      if(row.price){
        row.price.forEach(item=>{
          item.text=item.text.replace(',','.');
        })
      }
      if(row.listPrice){
        row.listPrice.forEach(item=>{
          item.text=item.text.replace(',','.');
        })
      }
      if(row.description){
        let inf=[];
        row.description.forEach(item=>{
          inf.push(item.text);
        })
        row.description=[{"text":inf.join(" ")}];
      }
      if(row.pricePerUnit){
        row.pricePerUnit.forEach(item=>{
          item.text=item.text.replace('icon icon-','');
        })
        row.pricePerUnitUam=[{"text":"kg"}];
      }
      if(row.availabilityText){
        row.availabilityText=[{"text":"Out Of Stock"}];
      }
      if(row.caloriesPerServing){
        let dExist;
        row.caloriesPerServing.forEach(item=>{
          if(item.text.indexOf('Energetická')==-1 || item.text.indexOf('Energie')==-1 || item.text.indexOf('pokrmu')==-1){
            dExist=false
          }else{
            row.caloriesFromFatPerServing=[{"text":"%"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.caloriesPerServing;
        }
      }
      if(row.totalFatPerServing){
        let dExist;
        row.totalFatPerServing.forEach(item=>{
          if(item.text.indexOf('Tuky')==-1){
            dExist=false
          }else{
            row.totalFatPerServingUam=[{"text":"g"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.totalFatPerServing;
        }
      }
      if(row.saturatedFatPerServing){
        let dExist;
        row.saturatedFatPerServing.forEach(item=>{
          if(item.text.indexOf('nasycený')==-1 || item.text.indexOf('nasyc')==-1){
            dExist=false
          }else{
            row.saturatedFatPerServingUam=[{"text":"g"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.saturatedFatPerServing;
        }
      }
      if(row.totalCarbPerServing){
        row.totalCarbPerServingUam=[{"text":"g"}];
      }
      if(row.dietaryFibrePerServing){
        let dExist;
        row.dietaryFibrePerServing.forEach(item=>{
          if(item.text.indexOf('Vláknina')==-1 || item.text.indexOf('vláknina')==-1){
            dExist=false
          }else{
            row.dietaryFibrePerServingUam=[{"text":"g"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.dietaryFibrePerServing;
        }
      }
      if(row.caloriesPerServing){
        let dExist;
        row.caloriesPerServing.forEach(item=>{
          if(item.text.indexOf('Energetická')==-1 || item.text.indexOf('Energie')==-1 || item.text.indexOf('pokrmu')==-1){
            dExist=false
          }else{
            row.caloriesFromFatPerServing=[{"text":"%"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.caloriesPerServing;
        }
      }
      if(row.totalSugarsPerServing){
        let dExist;
        row.totalSugarsPerServing.forEach(item=>{
          if(item.text.indexOf('cukry')==-1){
            dExist=false
          }else{
            row.totalSugarsPerServingUam=[{"text":"g"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.totalSugarsPerServing;
        }
      }
      if(row.proteinPerServing){
        let dExist;
        row.proteinPerServing.forEach(item=>{
          if(item.text.indexOf('Bílkoviny')==-1 || item.text.indexOf('bílkoviny')==-1){
            dExist=false
          }else{
            row.proteinPerServingUam=[{"text":"%"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.proteinPerServing;
        }
      }
      if(row.saltPerServing){
        let dExist;
        row.saltPerServing.forEach(item=>{
          if(item.text.indexOf('Sůl')==-1 || item.text.indexOf('sůl')==-1){
            dExist=false
          }else{
            row.saltPerServingUam=[{"text":"g"}];
            dExist=true;
          }
        })
        if(dExist==false){
          delete row.saltPerServing;
        }
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };