/**
 * @file src/functions/client/search.ts
 * 
 * @fileoverview search client logic file
 */

import { model } from "@prisma/client";

/**
 * 
 * @param models 
 * @returns 
 */
export const getUniqueModelers = (models: model[]): string[] => {
  const uniqueModelers = new Set<string>();
  models.forEach(model => uniqueModelers.add(model.modeled_by as string))
  return Array.from(uniqueModelers)
}

/**
 * 
 * @param models 
 * @returns 
 */
export const getUniqueAnnotators = (models: model[]): string[] => {
    const uniqueAnnotators = new Set<string>()
    // Filter only necessary because unannotated models appear on the collections page in development environments
    models.filter(model => model.annotator !== null).forEach(model => uniqueAnnotators.add(model.annotator as string))
    return Array.from(uniqueAnnotators)
  }