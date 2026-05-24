export interface IPostEntityDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: Date;
  deletedAt: Date | null;
}
