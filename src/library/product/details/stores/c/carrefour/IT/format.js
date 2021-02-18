
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
        // .replace(/"\s{1,}/g, '"')
        // .replace(/\s{1,}"/g, '"')
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
      for (const row of group) {
          /*if(row.variantId){
            try{
            let str=(row.variantId[0].text)?(row.variantId[0].text):'';
            row.variantId = [{ text: str.replace(/^0+/, '')}];}
            catch(e){
              console.log("error, ",e);
            }
          } */
          if(row.servingSize){
            try{
              let servingSizeText=row.servingSize[0].text;
              let pattTOEx=/(\d+)\s*g/;
              if(pattTOEx.test(servingSizeText)){
              let servingSizeWithUom=pattTOEx.exec(servingSizeText)[0];
              let servingSizeNumber=servingSizeWithUom.replace(/[^0-9]+/g, '');  
              row.servingSize = [{ text: servingSizeNumber}];}
              else{
                row.servingSize = [{ text: ''}];
              }
              }
              
              catch(e){
                console.log("error ",e);
              }
          }
          if(row.servingSizeUom){
            try{
              let servingSizeText=row.servingSizeUom[0].text;
              let pattTOEx=/(\d+)\s*g/;
              if(pattTOEx.test(servingSizeText)){
              let servingSizeWithUom=pattTOEx.exec(servingSizeText)[0];
              let servingSizeParameter=servingSizeWithUom.replace(/[0-9\s]+/g, '');  
              row.servingSizeUom = [{ text: servingSizeParameter}];}
              else{
                row.servingSizeUom = [{ text: ''}]; 
              }
              }
              catch(e){
                console.log("error ",e);
              }
          }

          if(row.quantity){
            try{
            let stringForQuant=(row.quantity[0].text)?(row.quantity[0].text):'';
            let lastWordInString=stringForQuant.split(" ").slice(-1);
            let secondLastWord=stringForQuant.split(" ").slice(-2,-1);
            if(/\d/.test(lastWordInString[0])){
                row.quantity = [{ text: lastWordInString[0]}];
            }
            else if(/\d/.test(secondLastWord[0])){
                let lastTowWord=stringForQuant.split(" ").slice(-2);
                let finalQuantity=lastTowWord.toString().replace(/(,[^,]*),/g,"$1 ").replace(/[()]/g, '').replace(',',' ');
                let arrayOFWords=finalQuantity.split(' ');
                if(arrayOFWords.length==3){
                  let lastWordInArray=arrayOFWords.pop();
                  let finalQuantityForComma=arrayOFWords.slice(0,2).join(',')+' '+lastWordInArray;
                  row.quantity = [{ text: finalQuantityForComma}];
                }
                else{
                row.quantity = [{ text: finalQuantity}];}
            }
            else{
              row.quantity = [{ text: ''}];
            }
          }
            catch(e){
              console.log(e);
            }
          }
         if(row.storage){
           try{
             let fullText=(row.storage[0].text)?(row.storage[0].text):'';
             let nextText=(row.storage[1].text)?(row.storage[1].text):'';
             let firstText=fullText.replace(nextText,'');
             let finalText=firstText+' '+nextText;
             row.storage = [{ text: finalText}];
         }
        catch(e){
          console.log(e);
        }
        }
        if(row.ingredientsList){
          try{
            let textIngredient='';
            row.ingredientsList.forEach(item => {
              textIngredient += item.text+' '; 
            });
            row.ingredientsList = [{ text: textIngredient.trim()}];
          }
          catch(e){
            console.log("error ",e);
          }
        }
        if(row.availabilityText){
          try{
            let textToCheckStock=row.availabilityText[0].text;
            if(textToCheckStock.includes('not-available')){
              row.availabilityText = [{ text: 'Out of stock'}];
            }
            else{
              row.availabilityText = [{ text: 'In stock'}];
            }
          }
          catch(e){
            console.log("error ", e);
          }
        }
      }}
    
    return cleanUp(data);
  };
  
  module.exports = { transform };
