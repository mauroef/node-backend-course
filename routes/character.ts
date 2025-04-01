import type { IncomingMessage, ServerResponse } from 'http';

import { safeParse } from 'valibot';

import {
  authenticateToken,
  type AuthenticatedRequest,
} from '../middleware/authentication';
import { authorizationRoles } from '../middleware/authorization';
import {
  addCharacter,
  CharacterSchema,
  deleteCharacter,
  getAllCharacters,
  getCharacterById,
  HttpMethod,
  Role,
  updateCharacter,
  type Character,
} from '../models';
import { parseBody } from '../utils/parseBody';

export const characterRouter = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { method, url } = req;

  if (!(await authenticateToken(req as AuthenticatedRequest, res))) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: 'Unauthorized 11' }));
    return;
  }

  if (url === '/characters' && method === HttpMethod.GET) {
    const characters = await getAllCharacters();

    res.statusCode = 200;
    res.end(JSON.stringify(characters));
    return;
  }

  if (url === '/character' && method === HttpMethod.GET) {
    const id = parseInt(url.split('/').pop() as string, 10);
    const character = getCharacterById(id);

    if (!character) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Character not found' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(character));
    return;
  }

  if (url === '/characters' && method === HttpMethod.POST) {
    if (
      !(await authorizationRoles(Role.ADMIN, Role.USER)(
        req as AuthenticatedRequest,
        res
      ))
    ) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: 'Forbidden' }));
      return;
    }

    const body = await parseBody(req);
    const result = safeParse(CharacterSchema, body);
    if (result.issues) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: result.issues }));
      return;
    }

    const character: Character = body;
    addCharacter(character);

    res.statusCode = 201;
    res.end(JSON.stringify(character));
    return;
  }

  if (url?.startsWith('/characters/') && method === HttpMethod.PATCH) {
    if (
      !(await authorizationRoles(Role.ADMIN)(req as AuthenticatedRequest, res))
    ) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: 'Forbidden' }));
      return;
    }

    const id = parseInt(url.split('/').pop() as string, 10);
    const body = await parseBody(req);
    const character: Character = body;
    const updatedCharacter = updateCharacter(id, character);

    if (!updatedCharacter) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Character not found' }));
      return;
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify(updatedCharacter));
    }

    return;
  }

  if (url?.startsWith('/character/') && method === HttpMethod.DELETE) {
    if (
      !(await authorizationRoles(Role.ADMIN)(req as AuthenticatedRequest, res))
    ) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: 'Forbidden' }));
      return;
    }

    const id = parseInt(url.split('/').pop() as string, 10);
    const success = deleteCharacter(id);
    if (!success) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Character not found' }));
    } else {
      res.statusCode = 204;
      res.end(JSON.stringify({ message: 'Character deleted' }));
    }

    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Route not found' }));
};
