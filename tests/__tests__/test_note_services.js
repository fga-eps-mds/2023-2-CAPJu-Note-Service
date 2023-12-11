import NoteService from '../../src/services/note.js';

const mockNoteModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
};

describe('NoteService test', () => {
  let noteService;

  beforeEach(() => {
    noteService = new NoteService(mockNoteModel);
  });

  describe('createNote', () => {
    it('should create a note', async () => {
      const mockNote = { /* mock data */ };

      mockNoteModel.create.mockResolvedValue(mockNote);

      const result = await noteService.createNote(mockNote);

      expect(mockNoteModel.create).toHaveBeenCalledWith(mockNote);
      expect(result).toEqual(mockNote);
    });
  });

  describe('findAllByRecord', () => {
    it('should find all notes by record', async () => {
      const mockRecord = 'exampleRecord';

      mockNoteModel.findAll.mockResolvedValue([]);

      const result = await noteService.findAllByRecord(mockRecord);

      expect(mockNoteModel.findAll).toHaveBeenCalledWith({
        where: { record: mockRecord },
      });
      expect(result).toEqual([]);
    });
  });

  describe('findAllByIdProcess', () => {
    it('should find all notes by idProcess', async () => {
      const mockIdProcess = 'exampleIdProcess';

      mockNoteModel.findAll.mockResolvedValue([]);

      const result = await noteService.findAllByIdProcess(mockIdProcess);

      expect(mockNoteModel.findAll).toHaveBeenCalledWith({
        where: { idProcess: mockIdProcess },
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOneById', () => {
    it('should find one note by idNote', async () => {
      const mockIdNote = 'exampleIdNote';
      const mockNote = { /* mock data */ };

      mockNoteModel.findOne.mockResolvedValue(mockNote);

      const result = await noteService.findOneById(mockIdNote);

      expect(mockNoteModel.findOne).toHaveBeenCalledWith({
        where: { idNote: mockIdNote },
      });
      expect(result).toEqual(mockNote);
    });
  });

  describe('deleteNoteById', () => {
    it('should delete a note by idNote', async () => {
      const mockIdNote = 'exampleIdNote';

      mockNoteModel.destroy.mockResolvedValue(1);

      const result = await noteService.deleteNoteById(mockIdNote);

      expect(mockNoteModel.destroy).toHaveBeenCalledWith({
        where: { idNote: mockIdNote },
      });
      expect(result).toBeTruthy();
    });
  });

  describe('updateNote', () => {
    it('should update a note by idNote', async () => {
      const mockIdNote = 'exampleIdNote';
      const mockCommentary = 'Updated commentary';
      const mockUpdatedNote = { idNote: mockIdNote, commentary: mockCommentary };

      mockNoteModel.update.mockResolvedValue([1]);
      mockNoteModel.findOne.mockResolvedValue(mockUpdatedNote);

      const result = await noteService.updateNote(mockCommentary, mockIdNote);

      expect(mockNoteModel.update).toHaveBeenCalledWith(
        { commentary: mockCommentary },
        { where: { idNote: mockIdNote } }
      );
      expect(mockNoteModel.findOne).toHaveBeenCalledWith({
        where: { idNote: mockIdNote },
      });
      expect(result).toEqual(mockUpdatedNote);
    });

    it('should return false if no rows were updated', async () => {
      const mockIdNote = 'exampleIdNote';
      const mockCommentary = 'Updated commentary';

      mockNoteModel.update.mockResolvedValue([0]);

      const result = await noteService.updateNote(mockCommentary, mockIdNote);

      expect(mockNoteModel.update).toHaveBeenCalledWith(
        { commentary: mockCommentary },
        { where: { idNote: mockIdNote } }
      );
      expect(result).toBeFalsy();
    });
  });
});

// Mockando o modelo Process
const mockProcessModel = {
  findOne: jest.fn(),
};

// Mockando o serviço ProcessAudService
jest.mock('./processAudService', () => {
  return jest.fn().mockImplementation(() => ({
    getLatestAudRecord: jest.fn(),
  }));
});

describe('ProcessService test', () => {
  let processService;

  beforeEach(() => {
    processService = new ProcessService(mockProcessModel);
  });

  describe('getProcessRecordById', () => {
    it('should get record by idProcess', async () => {
      const mockIdProcess = 'exampleIdProcess';
      const mockRecord = 'exampleRecord';

      mockProcessModel.findOne.mockResolvedValue({ idProcess: mockIdProcess, record: mockRecord });

      const result = await processService.getProcessRecordById(mockIdProcess);

      expect(mockProcessModel.findOne).toHaveBeenCalledWith({
        where: { idProcess: mockIdProcess },
        attributes: ['record'],
        raw: true,
      });
      expect(result).toEqual(mockRecord);
    });
  });

  describe('getProcessById', () => {
    it('should get process by idProcess with specified attributes', async () => {
      const mockIdProcess = 'exampleIdProcess';
      const mockAttributes = ['attr1', 'attr2'];
      const mockProcess = { idProcess: mockIdProcess, attr1: 'value1', attr2: 'value2' };

      mockProcessModel.findOne.mockResolvedValue(mockProcess);

      const result = await processService.getProcessById(mockIdProcess, mockAttributes);

      expect(mockProcessModel.findOne).toHaveBeenCalledWith({
        where: { idProcess: mockIdProcess },
        attributes: mockAttributes,
        raw: true,
      });
      expect(result).toEqual(mockProcess);
    });

    it('should get process by idProcess with all attributes if not specified', async () => {
      const mockIdProcess = 'exampleIdProcess';
      const mockProcess = { idProcess: mockIdProcess, attr1: 'value1', attr2: 'value2' };

      mockProcessModel.findOne.mockResolvedValue(mockProcess);

      const result = await processService.getProcessById(mockIdProcess);

      expect(mockProcessModel.findOne).toHaveBeenCalledWith({
        where: { idProcess: mockIdProcess },
        attributes: undefined,
        raw: true,
      });
      expect(result).toEqual(mockProcess);
    });
  });
});

// Testes para o método getLatestAudRecord de ProcessAudService (processAudService.js)
describe('ProcessAudService test', () => {
  let processAudService;

  beforeEach(() => {
    processAudService = new ProcessAudService(models.ProcessAud);
  });

  describe('getLatestAudRecord', () => {
    it('should get the latest audit record for a process', async () => {
      const mockIdProcess = 'exampleIdProcess';
      const mockLatestAudRecord = { idProcess: mockIdProcess, auditInfo: 'latest audit record' };

      models.ProcessAud.findOne.mockResolvedValue(mockLatestAudRecord);

      const result = await processAudService.getLatestAudRecord(mockIdProcess);

      expect(models.ProcessAud.findOne).toHaveBeenCalledWith({
        where: { idProcess: mockIdProcess },
        order: [['createdAt', 'DESC']],
        raw: true,
      });
      expect(result).toEqual(mockLatestAudRecord);
    });
  });
});
