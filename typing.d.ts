import { TypedObject } from '@portabletext/types';

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  
  post: {
    _ref: string;
    _type: string;
  };
  publishedAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  // replies:any[];
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
  mainImage: any;
  slug: { current: string };
  author: {
    name: string;
    image: any;
  };
  body: TypedObject[]; // Use TypedObject[] for Portable Text content
  comments: Comment[]; // Add this line to include comments
}