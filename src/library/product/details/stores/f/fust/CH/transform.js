/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      try {
        
      for(const keys in row)
        if (row.availabilityText[0].text.includes('innert 1-2'))
         {
            row.availabilityText[0] = { text: 'In Stock' };
            row.availabilityText.pop();
        }
         else if (row.availabilityText[0].text.includes('sofort lieferbar'))
          {
             row.availabilityText[0] = { text: 'In Stock' }; 
             row.availabilityText.pop();
            }
         else if (row.availabilityText[0].text.includes('Morgen geliefert!')) 
         {
            row.availabilityText[0] = { text: 'In Stock' };
            row.availabilityText.pop();
            }
       else if (row.availabilityText[0].text.includes('momentan nicht kaufbar')) 
       {
          row.availabilityText[0] = { text: 'Out of Stock' }; 
          } 
       else if (row.availabilityText[0].text.includes('Liefertermin nicht bekannt')) //check zipcode
       {
          if (row.availabilityText[2].text.includes('momentan nicht kaufbar')) {
            row.availabilityText[0] = { text: 'Out of Stock' };
          } else {
            row.availabilityText[0] = { text: 'In Stock' };
          }
          row.availabilityText.pop();
          row.availabilityText.pop();
        }
        let bulletCount=0;
        if(row.description){
          row.description.forEach(el => {
             if(el.text.charAt[0]=='-'){
              bulletCount++;}
              let str=el.text;
              if(str.charAt(0)=='-')
                bulletCount++;
          });
        row.descriptionBullets[0]={text:bulletCount};
        }
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
