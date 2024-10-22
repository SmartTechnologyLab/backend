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
    it('should return a new access token', async () => {
      const refreshToken = 'test-refresh-token';
      const user = { id: 1, username: 'testuser', password: 'testpassword' };
      const payload = { id: user.id };
      const newAccessToken = 'new-access-token';

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue(newAccessToken);

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual({ accessToken: newAccessToken });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'refreshSecretKey',
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: payload.id });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
      });
    });

    it('should throw an error if the refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid refresh token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });
});
