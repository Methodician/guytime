import * as functions from 'firebase-functions';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as cpp from 'child-process-promise';

import * as admin from 'firebase-admin';

import { Storage } from '@google-cloud/storage';
import { KeyMapI } from '.';

const gcs = new Storage();
const adminFs = admin.firestore();

// Often got memory limit exceeded (arbitrary for same photo sometimes and sometimes not)
const generousRuntimeOptions: functions.RuntimeOptions = {
  timeoutSeconds: 120,
  memory: '512MB',
};

export const onFileUpload = functions
  .runWith(generousRuntimeOptions)
  .storage.object()
  .onFinalize(object => {
    const { contentType, name } = object;

    if (!name) {
      console.error(
        'Seems like there is no file path (aka name) but AFAIK this should never log... Returning without executing.',
      );

      return;
    }

    const parsedName = path.parse(name);
    const { base, name: uid } = parsedName;
    const promises = [];

    const processUploadedProfileImage = async () => {
      const { bucket } = object;

      const metameta = !!object.metadata ? object.metadata : {};

      const gcsBucket = gcs.bucket(bucket);
      const tempFilePath = path.join(os.tmpdir(), `profileImage_${base}`);

      // Download once for all operations.
      await gcsBucket.file(name).download({ destination: tempFilePath });

      const rotateUploadedImage = async () => {
        if (metameta && metameta.autoOrient && metameta.autoOrient === 'done') {
          return;
        }

        await cpp.spawn('convert', [
          tempFilePath,
          '-auto-orient',
          tempFilePath,
        ]);
        const newMetadata = { contentType, metadata: { autoOrient: 'done' } };
        await gcsBucket.upload(tempFilePath, {
          destination: name,
          metadata: newMetadata,
        });

        return;
      };

      const createSpecifiedThumbnail = async (size: 45 | 90) => {
        const avatarSize = `${size}x${size}`;
        const paddedSize = size * (16 / 9);
        const cppSize = `${paddedSize}x${paddedSize}`;

        await cpp.spawn('convert', [
          tempFilePath,
          '-thumbnail',
          `${cppSize}>`,
          tempFilePath,
        ]);

        const thumbFilePath = path.join('profileImages', avatarSize, base);

        try {
          await gcsBucket.upload(tempFilePath, {
            destination: thumbFilePath,
          });
          await recordUploadedImageName(avatarSize as any); // ToDo: type this better
        } catch (error) {
          console.error(`couldn't upload profile image of size ${avatarSize}`);
        }

        return;
      };

      await rotateUploadedImage();
      await createSpecifiedThumbnail(90);
      await createSpecifiedThumbnail(45);

      // Delete local files to free up space
      fs.unlinkSync(tempFilePath);

      return;
    };

    const recordUploadedImageName = async (
      size: 'fullSize' | '90x90' | '45x45',
    ) => {
      const userInfoRef = adminFs.collection('users').doc(uid);

      const generateRandomHex = (length: number) =>
        [...Array(length)]
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('');
      const userInfoUpdate: KeyMapI<ProfileImageTrackerI> = {};
      userInfoUpdate[`uploadedProfileImageMap.${size}`] = {
        fileName: base,
        imageUpdateRando: generateRandomHex(6),
      };
      await userInfoRef.update(userInfoUpdate);
      return;
    };

    if (contentType?.startsWith('image/')) {
      // An image was uploaded.
      if (name?.startsWith('profileImages/fullSize')) {
        // It was a profile image
        promises.push(recordUploadedImageName('fullSize'));
        promises.push(processUploadedProfileImage());
      }
    }

    return Promise.all(promises);
  });
export interface ProfileImageNameMapI {
  fullSize?: ProfileImageTrackerI;
  '90x90'?: ProfileImageTrackerI;
  '45x45'?: ProfileImageTrackerI;
}

export interface ProfileImageTrackerI {
  fileName: string;
  imageUpdateRando: string;
}
