import services from '../services/_index.js';

export class NoteController {
  constructor() {
    this.noteService = services.noteService;
    this.processAudService = services.processAudService;
  }

  index = async (req, res) => {
    const { idProcess } = req.params;
    try {
      const note = await this.noteService.findAllByIdProcess(idProcess);
      return res.status(200).json(note);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao buscar observação: ${error}` });
    }
  };

  newNote = async (req, res) => {
    const { commentary, idProcess, idStageA, idStageB } = req.body;
    try {
      const note = await this.noteService.createNote({
        commentary,
        idProcess,
        idStageA,
        idStageB,
      });
      await this.processAudService.create(
        idProcess,
        null,
        'NOTE_CHANGE',
        req,
        `Comentário ${commentary} adicionado`,
      );
      return res.status(200).json(note);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: `Erro ao criar observação: ${error}` });
    }
  };

  delete = async (req, res) => {
    const { idNote } = req.params;
    try {
      const note = await this.noteService.findOneById(idNote);
      if (!note) {
        return res.status(400).json({ error: `idNote ${idNote} não existe!` });
      } else {
        await this.noteService.deleteNoteById(idNote);
        await this.processAudService.create(
          note.idProcess,
          null,
          'NOTE_CHANGE',
          req,
          `Comentário ${note.commentary} removido`,
        );
        return res
          .status(200)
          .json({ message: 'Observação deletada com sucesso.' });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao deletar observação: ${error}` });
    }
  };

  update = async (req, res) => {
    const { commentary } = req.body;
    const { idNote } = req.params;

    try {
      const originalNote = await this.noteService.findOneById(idNote);
      const updatedNote = await this.noteService.updateNote(commentary, idNote);
      if (updatedNote === false) {
        return res.status(400).json({ error: `idNote ${idNote} não existe!` });
      }
      await this.processAudService.create(
        originalNote.idProcess,
        null,
        'NOTE_CHANGE',
        req,
        `Comentário ${originalNote.commentary} alterado para ${commentary}`,
      );
      return res
        .status(200)
        .json({ message: 'Observação atualizada com sucesso.' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao atualizar observação: ${error}` });
    }
  };
}
