import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { aiReportService } from '../services/ai_report.service';
import api from '../services/api';
import { ProcessingStatus } from '../models/enums';

// On mock le module api
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  }
}));

describe('aiReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAIReports', () => {
    it('should call api.get with correct endpoint and default params', async () => {
      const mockData = [{ id_report: 1, classification: 'SPAM_LIKE' }];
      jest.mocked(api.get).mockResolvedValue({ data: mockData } as any);

      const result = await aiReportService.getAIReports();

      expect(api.get).toHaveBeenCalledWith('/internal/admin/ai-reports/', {
        params: { offset: 0, limit: 100 },
      });
      expect(result).toEqual(mockData);
    });

    it('should call api.get with custom pagination params', async () => {
      jest.mocked(api.get).mockResolvedValue({ data: [] } as any);

      await aiReportService.getAIReports({ offset: 10, limit: 20 });

      expect(api.get).toHaveBeenCalledWith('/internal/admin/ai-reports/', {
        params: { offset: 10, limit: 20 },
      });
    });
  });

  describe('updateAIReportState', () => {
    it('should call api.patch with correct endpoint and data', async () => {
      const mockUpdatedReport = { id_report: 1, state: 'APPROVED' };
      jest.mocked(api.patch).mockResolvedValue({ data: mockUpdatedReport } as any);

      const reportUpdate = { state: ProcessingStatus.APPROVED };
      const result = await aiReportService.updateAIReportState(1, reportUpdate);

      expect(api.patch).toHaveBeenCalledWith(
        '/internal/admin/ai-reports/1',
        reportUpdate
      );
      expect(result).toEqual(mockUpdatedReport);
    });
  });

  describe('getAIReport', () => {
    it('should call api.get for a single report', async () => {
      const mockReport = { id_report: 1, classification: 'NORMAL_CONTENT' };
      jest.mocked(api.get).mockResolvedValue({ data: mockReport } as any);

      const result = await aiReportService.getAIReport(1);

      expect(api.get).toHaveBeenCalledWith('/internal/admin/ai-reports/1');
      expect(result).toEqual(mockReport);
    });
  });
});
