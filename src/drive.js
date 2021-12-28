import { createReadStream } from "fs";
import { google } from "googleapis";

export async function uploadFile(auth,fileNameInDrive,path,folderId) {
  const drive = google.drive({ version: "v3", auth });
  const resource = {
    name: fileNameInDrive,
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: [folderId]
  };
  const media = {
    body: createReadStream(path),
    mimeType: "application/vnd.ms-excel",
  };

  try {
    const request = await Promise.resolve(drive.files.create({
      resource,
      media,
      fields: "id",
    }));

    return request.data.id
  } catch (error) {
    console.log(error)
    if(error.code === 500) uploadFile(auth,fileNameInDrive,path,folderId);
  }
}

export async function createFolder(auth) {
  const drive = google.drive({ version: "v3", auth });
  let resource = {
    name: `Turma 5`,
    mimeType: "application/vnd.google-apps.folder",
  };

  try {
    const request = await Promise.resolve(
      drive.files.create({
        resource,
        fields: "id",
      })
    );
    return request.data.id;
  } catch (err) {
    console.log(err);
  }
}