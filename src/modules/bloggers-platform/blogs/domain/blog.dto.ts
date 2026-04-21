/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface CreateBlogInstanceDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface UpdateBlogDto extends CreateBlogInstanceDto {}
