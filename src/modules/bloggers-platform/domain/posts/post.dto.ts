export interface CreatePostInstanceDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
}

export interface UpdatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
