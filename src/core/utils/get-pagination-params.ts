import { SortOrder } from 'mongoose';
import { SortDirection } from '../dto';

type Args = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};

export const getPaginationParams = ({ pageNumber, pageSize, sortBy, sortDirection }: Args) => {
  const sort: Record<string, SortOrder> = {
    [sortBy]: sortDirection === SortDirection.Asc ? 1 : -1,
  };

  const skip = (pageNumber - 1) * pageSize;

  return {
    sort,
    skip,
    limit: pageSize,
  };
};
