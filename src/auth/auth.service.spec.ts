import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/User';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refreshToken', () => {
    it('should return a new access token and refresh token', async () => {
      const refreshToken = 'test-refresh-token';
      const user = { id: 1, username: 'testuser', password: 'testpassword' };
      const payload = { id: user.id };
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);
      jest.spyOn(jwtService, 'sign').mockImplementation((userData, options) => {
        if (options && options.secret === 'refreshSecretKey') {
          return newRefreshToken;
        }
        return newAccessToken;
      });

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, { secret: 'refreshSecretKey' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: payload.id });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id, username: user.username });
    });

    it('should throw an error if the refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid refresh token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw an error if the user is not found', async () => {
      const refreshToken = 'test-refresh-token';
      const payload = { id: 1 };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow('User not found');
    });
  });

  describe('generateTokens', () => {
    it('should return an object with accessToken and refreshToken', () => {
      const user = { id: 1, username: 'testuser', password: 'testpassword' };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      jest.spyOn(jwtService, 'sign').mockImplementation((userData, options) => {
        if (options && options.secret === 'refreshSecretKey') {
          return refreshToken;
        }
        return accessToken;
      });

      const result = service.generateTokens(user as User);

      expect(result).toEqual({ accessToken, refreshToken });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id, username: user.username });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: user.id, username: user.username },
        { secret: 'refreshSecretKey', expiresIn: '7d' },
      );
    });
  });

  describe('validateUser', () => {
    it('should return the user object if the username and password are correct', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const user = { id: 1, username, password };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);

      const result = await service.validateUser({ username, password });

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ username });
    });

    it('should return null if the username is incorrect', async () => {
      const username = 'wronguser';
      const password = 'testpassword';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.validateUser({ username, password });

      expect(result).toBeNull();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ username });
    });

    it('should return null if the password is incorrect', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const user = { id: 1, username, password: 'testpassword' };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);

      const result = await service.validateUser({ username, password });

      expect(result).toBeNull();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ username });
    });
  });
});
