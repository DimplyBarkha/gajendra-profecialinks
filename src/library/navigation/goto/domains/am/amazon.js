async function implementation (inputs, { addressRegExp, zipRegExp, countryCode, domain }, context, { customGoto }) {
  inputs.context = context;
  await customGoto(inputs);
};

module.exports = {
  dependencies: {
    customGoto: 'action:navigation/goto/domains/am/amazonCustomGoto',
  },
  implementation,
};
