import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            refreshToken: jest.fn(),
            generateRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('refresh', () => {
    it('should call authService.refreshToken with the correct refresh token', async () => {
      const refreshDto: RefreshDto = { refreshToken: 'test-refresh-token' };
      await controller.refresh(refreshDto);
      expect(authService.refreshToken).toHaveBeenCalledWith(
        'test-refresh-token',
      );
    });

    it('should return a new access token', async () => {
      const refreshDto: RefreshDto = { refreshToken: 'test-refresh-token' };
      const result = { accessToken: 'new-access-token' };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      expect(await controller.refresh(refreshDto)).toBe(result);
    });
  });
});
