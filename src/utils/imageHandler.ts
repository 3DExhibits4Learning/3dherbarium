/**
 * @file /utils/imageHandler.ts
 * @fileoverview functions for img tags used throughout the site.
 */

import { StaticImageData } from "next/image";

export const handleImgClick = (url: string): void => {
  window.open(url, '_blank');
};

export const handleImgError = (currentTarget: HTMLImageElement, image: StaticImageData) => {
  currentTarget.onerror = null;
  currentTarget.src = image.src;
}