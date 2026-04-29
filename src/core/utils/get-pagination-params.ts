type Args = {
  pageNumber: number;
  pageSize: number;
};

export const getPaginationParams = ({ pageNumber, pageSize }: Args) => {
  const skip = (pageNumber - 1) * pageSize;

  return {
    skip,
    limit: pageSize,
  };
};
