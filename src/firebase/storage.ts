import {storage} from './firebase';

export const getAvatar = (id: string) => storage.ref().child(`avatars/${id}`);

export const getPlayerImageUrl = async (id: string, callback: (downloadUrl: string) => void) => {
  const snapshot = getAvatar(id);

  const downloadUrl = await snapshot.getDownloadURL();
  callback(downloadUrl);
};
