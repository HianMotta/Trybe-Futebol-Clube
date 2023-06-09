import { Response, Request, NextFunction } from 'express';
import ApiError from '../error/apiError';
import Team from '../database/models/Team';
import JWT from '../jwt/jwtUtils';

const jwt = new JWT();

const validateMatch = async (req: Request, _res: Response, next: NextFunction) => {
  const { homeTeamId, awayTeamId } = req.body;
  const { authorization } = req.headers;
  if (homeTeamId === awayTeamId) {
    throw new ApiError(422, 'It is not possible to create a match with two equal teams');
  }

  const teams = await Team.findAll({ where: { id: [homeTeamId, awayTeamId] } });
  console.log(teams);
  if (teams.length < 2) throw new ApiError(404, 'There is no team with such id!');

  try {
    jwt.validateToken(authorization as string);
  } catch (error) {
    throw new ApiError(401, 'Token must be a valid token');
  }

  next();
};

export default validateMatch;
