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
      const mockNote = {
        /* mock data */
      };

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

  describe('findOneById', () => {
    it('should find one note by idNote', async () => {
      const mockIdNote = 'exampleIdNote';
      const mockNote = {
        /* mock data */
      };

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
      const mockUpdatedNote = {
        idNote: mockIdNote,
        commentary: mockCommentary,
      };

      mockNoteModel.update.mockResolvedValue([1]);
      mockNoteModel.findOne.mockResolvedValue(mockUpdatedNote);

      const result = await noteService.updateNote(mockCommentary, mockIdNote);

      expect(mockNoteModel.update).toHaveBeenCalledWith(
        { commentary: mockCommentary },
        { where: { idNote: mockIdNote } },
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
        { where: { idNote: mockIdNote } },
      );
      expect(result).toBeFalsy();
    });
  });
});
