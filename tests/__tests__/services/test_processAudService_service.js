import ProcessAudService from '../../../src/services/processAudService.js';
import { userFromReq } from '../../../middleware/authMiddleware.js';

// Mocking dependencies
jest.mock('../../../src/services/process.js', () => {
  return jest.fn().mockImplementation(() => ({
    getProcessRecordById: jest.fn().mockResolvedValue({
      /* mock process record */
    }),
  }));
});

jest.mock('../../../middleware/authMiddleware.js', () => ({
  userFromReq: jest.fn().mockResolvedValue({ cpf: 'mockedUserCPF' }),
}));

describe('ProcessAudService', () => {
  let processAudService;
  let processAudModelMock;

  beforeEach(() => {
    // Mocking ProcessAudModel
    processAudModelMock = {
      create: jest.fn(),
    };

    processAudService = new ProcessAudService(processAudModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of ProcessAudService', () => {
    expect(processAudService).toBeInstanceOf(ProcessAudService);
  });

  it('should call create correctly', async () => {
    const idProcess = 1;
    const newValues = {
      /* mock new values */
    };
    const operation = 'update';
    const req = {
      /* mock request object */
    };
    const remarks = 'some remarks';

    await processAudService.create(
      idProcess,
      newValues,
      operation,
      req,
      remarks,
    );

    expect(userFromReq).toHaveBeenCalledWith(req);
    expect(processAudModelMock.create).toHaveBeenCalledWith({
      idProcess,
      processRecord: expect.any(Object),
      operation,
      changedBy: 'mockedUserCPF',
      oldValues: null,
      newValues: JSON.stringify(newValues),
      changedAt: expect.any(Date),
      remarks,
    });
  });
});
