const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: "admin.json",
});

const uploadProfileImage = async (profileImage, uuid, collection) => {
  if (!profileImage || profileImage.size === 0) {
    return ""; // Empty image URL
  }

  const downLoadPath =
    "https://firebasestorage.googleapis.com/v0/b/crud-e108b.appspot.com/o/";
  const bucket = storage.bucket("gs://crud-e108b.appspot.com/");

  try {
    const imageResponse = await bucket.upload(profileImage.path, {
      destination: `${collection}/${profileImage.name}`,
      resumable: true,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });

    return (
      downLoadPath +
      encodeURIComponent(imageResponse[0].name) +
      "?alt=media&token=" +
      uuid
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload image.");
  }
};

module.exports = uploadProfileImage;
