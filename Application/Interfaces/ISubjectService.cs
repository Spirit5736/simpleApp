using Application.DTOs;

namespace Application.Interfaces;

public interface ISubjectService
{
    Task<IEnumerable<SubjectDto>> GetAllSubjectsAsync();
    Task<SubjectDto?> GetSubjectByIdAsync(int id);
    Task<SubjectDto> CreateSubjectAsync(CreateSubjectDto createDto);
    Task<SubjectDto> UpdateSubjectAsync(int id, UpdateSubjectDto updateDto);
    Task<bool> DeleteSubjectAsync(int id);
    Task<double> GetAverageGradeAsync();
}

