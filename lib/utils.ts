import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatCompactDate(value?: string | null) {
  if (!value) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function calculateDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function formatDistanceKm(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return "Distance unavailable";
  }

  return `${value.toFixed(1)} km away`;
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function cleanJsonResponse(rawText: string) {
  return rawText.replace(/```json|```/g, "").trim();
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function makeSuggestedDocumentName(
  patientName?: string | null,
  diseaseName?: string | null,
  uploadDate?: string | null
) {
  const patient = slugify(patientName || "patient") || "patient";
  const disease = slugify(diseaseName || "medical-record") || "medical-record";
  const date = uploadDate
    ? new Date(uploadDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return `${patient}_${disease}_${date}`;
}

export function extractStoragePathFromPublicUrl(url: string) {
  const marker = "/storage/v1/object/public/medical-documents/";
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length));
}

export function getInitials(name?: string | null) {
  if (!name) {
    return "MH";
  }

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export async function fileToBase64(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

export async function compressImageFile(file: File) {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / imageBitmap.width);

  canvas.width = Math.round(imageBitmap.width * scale);
  canvas.height = Math.round(imageBitmap.height * scale);

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.72)
  );

  if (!blob) {
    throw new Error("Unable to compress image.");
  }

  return new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
    type: "image/jpeg"
  });
}
