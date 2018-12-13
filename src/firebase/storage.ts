import {storage} from './firebase';

export const getAvatar = (id: string) => storage.ref().child(`avatars/${id}`);