const buildDataSource = (
  records: number,
  cols: string,
  callback?: Function
) => {
  if (callback) {
    return callback();
  }

  const dataSource = [...new Array(records)].map((_: any, index: number) => {
    const result = {
      id: index,
    };

    cols.split('').map((letter: string) => {
      result[letter] = letter.toUpperCase() + ' ' + (index + 1);
    });

    return result;
  });

  return dataSource;
};

export default buildDataSource;
