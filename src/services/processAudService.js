import { userFromReq } from '../../middleware/authMiddleware.js';
import ProcessService from './process.js';
import models from '../models/_index.js';

class ProcessAudService {
  constructor(ProcessAudModel) {
    this.processAudRepository = ProcessAudModel;
  }

  async create(idProcess, newValues, operation, req, remarks) {
    // For memory and logic purposes, the "newValues" param should only receive the fields that changed.

    const processRecord = await new ProcessService(
      models.Process,
    ).getProcessRecordById(idProcess);

    const auditEntry = {
      idProcess,
      processRecord,
      operation,
      changedBy: (await userFromReq(req)).cpf,
      oldValues: null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      changedAt: new Date(),
      remarks: remarks || null,
    };

    return await this.processAudRepository.create(auditEntry);
  }
}

export default ProcessAudService;
