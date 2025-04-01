import { minLength, string, object, pipe, type InferInput } from 'valibot';

/**
 * Schema for a character, ensuring name and lastName have a minimum length of 6.
 */
export const CharacterSchema = object({
  name: pipe(string(), minLength(6)),
  lastName: pipe(string(), minLength(6)),
});

/**
 * Type definition for a Character including an id.
 */
export type Character = InferInput<typeof CharacterSchema> & { id: number };

/**
 * In-memory storage for characters.
 */
const characters: Map<number, Character> = new Map();

/**
 * Retrieves all characters.
 * @returns {Character[]} Array of all characters.
 */
export const getAllCharacters = (): Character[] => {
  return Array.from(characters.values());
};

/**
 * Retrieves a character by its ID.
 * @param {number} id - The ID of the character.
 * @returns {Character | undefined} The character if found, otherwise undefined.
 */
export const getCharacterById = (id: number): Character | undefined => {
  return characters.get(id);
};

/**
 * Adds a new character to the storage.
 * @param {Character} character - The character to add.
 * @returns {Character} The newly added character with a generated ID.
 */
export const addCharacter = (character: Character): Character => {
  if (character.id && !characters.has(character.id)) {
    console.error(`Character with id '${character.id}' already exists`);
    return character;
  }
  const newCharacter = {
    ...character,
    id: new Date().getTime(),
  };

  characters.set(newCharacter.id, newCharacter);
  return newCharacter;
};

/**
 * Updates an existing character by ID.
 * @param {number} id - The ID of the character to update.
 * @param {Character} updatedCharacter - The updated character data.
 * @returns {Character | null} The updated character if successful, otherwise null.
 */
export const updateCharacter = (
  id: number,
  updatedCharacter: Character
): Character | null => {
  if (!characters.has(id)) {
    console.error(`Character with id '${id}' not found`);
    return null;
  }

  characters.set(id, updatedCharacter);
  return updatedCharacter;
};

/**
 * Deletes a character by ID.
 * @param {number} id - The ID of the character to delete.
 * @returns {boolean} True if deletion was successful, false otherwise.
 */
export const deleteCharacter = (id: number): boolean => {
  if (!characters.has(id)) {
    console.error(`Character with id '${id}' not found`);
    return false;
  }

  characters.delete(id);
  return true;
};
