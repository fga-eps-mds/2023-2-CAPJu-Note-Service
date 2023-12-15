import { UserService } from '../../../src/services/user.js';
import models from '../../../src/models/_index.js';

jest.mock('../../../src/models/_index.js', () => ({
  User: {
    findOne: jest.fn(),
  },
  Role: {
    findOne: jest.fn(),
  },
}));

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of UserService', () => {
    expect(userService).toBeInstanceOf(UserService);
  });

  it('should find user with role correctly', async () => {
    const mockUser = {
      cpf: '12345678900',
      idRole: 1,
      // Add other user properties as needed for testing
    };

    const mockRole = {
      idRole: 1,
      allowedActions: ['READ', 'WRITE'],
      // Add other role properties as needed for testing
    };

    models.User.findOne.mockResolvedValue(mockUser);
    models.Role.findOne.mockResolvedValue(mockRole);

    const attributes = ['name', 'email'];
    const result = await userService.findUserWithRole(
      '12345678900',
      attributes,
    );

    expect(models.User.findOne).toHaveBeenCalledWith({
      where: { cpf: '12345678900' },
      attributes: [...attributes, 'idRole'],
      raw: true,
    });

    expect(models.Role.findOne).toHaveBeenCalledWith({
      where: { idRole: 1 },
      attributes: ['allowedActions'],
    });

    const expectedUserData = {
      ...mockUser,
      role: { idRole: 1, allowedActions: ['READ', 'WRITE'] },
    };

    expect(result).toEqual(expectedUserData);
  });

  it('should handle case when user is not found', async () => {
    models.User.findOne.mockResolvedValue(null);

    const result = await userService.findUserWithRole('nonexistentcpf');

    expect(result).toBeUndefined();
  });
});
