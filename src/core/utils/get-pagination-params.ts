type Args = {
  pageNumber: number;
  pageSize: number;
};

export const getPaginationParams = ({ pageNumber, pageSize }: Args) => {
  const offset = (pageNumber - 1) * pageSize;

  return {
    offset,
    limit: pageSize,
  };
};
