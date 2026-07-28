import "server-only";

import { v2 as mediaProvider } from "cloudinary";

function mediaConfig() {
  return {
    cloudName:
      process.env.MEDIA_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.MEDIA_API_KEY ?? process.env.CLOUDINARY_API_KEY,
    apiSecret:
      process.env.MEDIA_API_SECRET ?? process.env.CLOUDINARY_API_SECRET,
    folder: process.env.MEDIA_FOLDER ?? process.env.CLOUDINARY_FOLDER ?? "zenith-academy",
  };
}

function configureMedia() {
  const { cloudName, apiKey, apiSecret } = mediaConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Media storage credentials are not configured.");
  }

  mediaProvider.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export type AdminImageFolder = "course-images" | "domain-images";

function createSignedUpload(subfolder: string) {
  configureMedia();

  const { cloudName, apiKey, folder: baseFolder } = mediaConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `${baseFolder}/${subfolder}`;
  const apiSecret = mediaConfig().apiSecret!;

  return {
    timestamp,
    folder,
    signature: mediaProvider.utils.api_sign_request(
      { folder, timestamp },
      apiSecret
    ),
    apiKey: apiKey!,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
}

export function createSignedReceiptUpload() {
  const signed = createSignedUpload("registration-receipts");
  return {
    ...signed,
    uploadUrl: signed.uploadUrl.replace("/image/upload", "/auto/upload"),
  };
}

export function createSignedAdminImageUpload(folder: AdminImageFolder) {
  return createSignedUpload(folder);
}

export async function verifyReceiptUpload(
  publicId: string,
  resourceType: "image" | "raw"
) {
  configureMedia();

  const expectedFolder = `${mediaConfig().folder}/registration-receipts/`;
  const resource = await mediaProvider.api.resource(publicId, {
    resource_type: resourceType,
  });
  const allowedFormats = new Set(["jpg", "jpeg", "png", "pdf"]);

  if (
    !resource.public_id.startsWith(expectedFolder) ||
    resource.bytes > 10 * 1024 * 1024 ||
    !allowedFormats.has(String(resource.format).toLowerCase())
  ) {
    throw new Error("The uploaded receipt is invalid.");
  }

  return {
    publicId: resource.public_id as string,
    secureUrl: resource.secure_url as string,
  };
}

export async function verifyAdminImageUpload(
  publicId: string,
  folder: AdminImageFolder
) {
  configureMedia();

  const expectedFolder = `${mediaConfig().folder}/${folder}/`;
  const resource = await mediaProvider.api.resource(publicId, {
    resource_type: "image",
  });
  const allowedFormats = new Set(["jpg", "jpeg", "png", "webp"]);

  if (
    !resource.public_id.startsWith(expectedFolder) ||
    resource.bytes > 10 * 1024 * 1024 ||
    !allowedFormats.has(String(resource.format).toLowerCase())
  ) {
    throw new Error("The uploaded image is invalid.");
  }

  return {
    publicId: resource.public_id as string,
    secureUrl: resource.secure_url as string,
    resourceType: String(resource.resource_type ?? "image"),
    format: String(resource.format ?? ""),
    width: Number(resource.width ?? 0),
    height: Number(resource.height ?? 0),
    bytes: Number(resource.bytes ?? 0),
  };
}

export async function deleteMediaAsset(publicId: string) {
  configureMedia();
  return mediaProvider.uploader.destroy(publicId, { resource_type: "image" });
}
