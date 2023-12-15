import UserAccessLogService from '../../../src/services/userAccessLog.js';
import models from '../../../src/models/_index.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

jest.mock('../../../src/models/_index.js', () => ({
  UserAccessLog: {
    findOne: jest.fn(),
  },
}));

describe('UserAccessLogService', () => {
  let userAccessLogService;

  beforeEach(() => {
    userAccessLogService = new UserAccessLogService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of UserAccessLogService', () => {
    expect(userAccessLogService).toBeInstanceOf(UserAccessLogService);
  });

  it('should check for an active session related to JWT correctly', async () => {
    const mockJwtToken = 'mockedJwtToken';
    const mockDecodedToken = { id: { sessionId: 123 } };

    jwt.decode.mockReturnValue(mockDecodedToken);

    const mockSession = { id: 456 };
    models.UserAccessLog.findOne.mockResolvedValue(mockSession);

    const result = await userAccessLogService.hasActiveSessionRelatedToJWT(
      mockJwtToken,
    );

    expect(jwt.decode).toHaveBeenCalledWith(mockJwtToken);
    expect(models.UserAccessLog.findOne).toHaveBeenCalledWith({
      where: {
        sessionId: 123,
        logoutTimestamp: null,
      },
      attributes: ['id'],
      order: [['id', 'DESC']],
      raw: true,
      logging: false,
    });

    expect(result).toBe(true);
  });

  it('should handle case when there is no active session related to JWT', async () => {
    const mockJwtToken = 'mockedJwtToken';
    const mockDecodedToken = { id: { sessionId: 123 } };

    jwt.decode.mockReturnValue(mockDecodedToken);

    models.UserAccessLog.findOne.mockResolvedValue(null);

    const result = await userAccessLogService.hasActiveSessionRelatedToJWT(
      mockJwtToken,
    );

    expect(jwt.decode).toHaveBeenCalledWith(mockJwtToken);
    expect(models.UserAccessLog.findOne).toHaveBeenCalledWith({
      where: {
        sessionId: 123,
        logoutTimestamp: null,
      },
      attributes: ['id'],
      order: [['id', 'DESC']],
      raw: true,
      logging: false,
    });

    expect(result).toBe(false);
  });
});
