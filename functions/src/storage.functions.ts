import * as functions from 'firebase-functions';
import * as path from 'path';
import * as os from 'os';
// import * as fs from 'fs';
import * as cpp from 'child-process-promise';

import { Storage } from '@google-cloud/storage';

const gcs = new Storage();

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

    const createProfileImageThumbnail = async () => {
      const { bucket, metadata } = object;

      if (!name) {
        console.error(
          'Seems like there is no file path (aka name) but AFAIK this should never log... Returning without executing.',
        );
        return;
      }

      if (!metadata) {
        console.error(
          'Seems like there is no file metadata but AFAIK this should never log... Returning without executing.',
        );
        return;
      }

      const parsedName = path.parse(name);
      // const splitDir = parsedName.dir.split('/');
      const uid = parsedName.base;

      const gcsBucket = gcs.bucket(bucket);
      const tempFilePath = path.join(os.tmpdir(), `profileImage_${uid}`);

      // Download once for all operations.
      await gcsBucket.file(name).download({ destination: tempFilePath });

      const create90x90Thumbnail = async () => {
        await cpp.spawn('convert', [
          tempFilePath,
          '-thumbnail',
          '90x90>',
          tempFilePath,
        ]);

        const newMetadata = { ...metadata, contentType };
        const thumbFilePath = path.join('profileThumbnails', uid, '90x90');

        return gcsBucket.upload(tempFilePath, {
          destination: thumbFilePath,
          metadata: newMetadata,
        });
      };

      return create90x90Thumbnail();
    };

    if (contentType?.startsWith('image/')) {
      // An image was uploaded.
      if (name?.startsWith('profileImages')) {
        // It was a profile image
        return createProfileImageThumbnail();
      }
    }
    return;
  });
