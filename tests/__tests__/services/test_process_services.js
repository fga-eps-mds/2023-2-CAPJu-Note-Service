import ProcessService from '../../../src/services/process.js';

// Mocking ProcessAudService
jest.mock('../../../src/services/processAudService.js', () => {
  return jest.fn().mockImplementation(() => ({
    // Mock the methods you need from ProcessAudService
    someMethod: jest.fn(),
  }));
});

describe('ProcessService', () => {
  let processService;
  let processModelMock;

  beforeEach(() => {
    // Mocking ProcessModel
    processModelMock = {
      findOne: jest.fn(),
    };

    processService = new ProcessService(processModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of ProcessService', () => {
    expect(processService).toBeInstanceOf(ProcessService);
  });

  it('should call getProcessRecordById correctly', async () => {
    // Mocking the result of getProcessById
    processModelMock.findOne.mockResolvedValue({ record: 'someRecord' });

    const result = await processService.getProcessRecordById(1);

    expect(processModelMock.findOne).toHaveBeenCalledWith({
      where: { idProcess: 1 },
      attributes: ['record'],
      raw: true,
    });

    expect(result).toBe('someRecord');
  });

  it('should call getProcessById correctly', async () => {
    // Mocking the result of getProcessById
    processModelMock.findOne.mockResolvedValue({
      idProcess: 1,
      someProperty: 'someValue',
    });

    const result = await processService.getProcessById(1, ['someProperty']);

    expect(processModelMock.findOne).toHaveBeenCalledWith({
      where: { idProcess: 1 },
      attributes: ['someProperty'],
      raw: true,
    });

    expect(result).toEqual({ idProcess: 1, someProperty: 'someValue' });
  });
});
