import { POST_REPOSITORY } from './../../core/constants';
import { Post } from './post.entiry';

export const postsProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
];
