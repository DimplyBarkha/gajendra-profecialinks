module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  const thisUPC = await context.evaluate(() => {
    const url = window.location.href;
    let splits = url && url.split('dp/product/')[1] ? url.split('dp/product/')[1].split('/?') : [];
    if (splits.length < 1) {
      splits = url && url.split('dp/')[1] ? url.split('dp/')[1].split('/') : [];
    }
    return splits[0];
  });

  const allVariants = await amazonHelp.getVariants();
  if (thisUPC && !allVariants.includes(thisUPC.slice(0, 10))) {
    allVariants.push(thisUPC.slice(0, 10));
  }

  await context.evaluate((allVariants) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    allVariants.forEach(variant => {
      addHiddenDiv('ii_variant', variant);
    });
  }, allVariants);

  return await context.extract(`./product/details/stores/a/amazon/${parameters.country}/variantsExtract`);
};
