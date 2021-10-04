const buildColumns = cols => {
  return cols.split('').map(letter => {
    return {
      defaultWidth: 120,
      header: letter.toUpperCase(),
      name: letter,
    };
  });
};

export default buildColumns;
