using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;

namespace Application.Services;

public class SubjectService : ISubjectService
{
    private readonly IRepository<Subject> _repository;
    private readonly IMapper _mapper;

    public SubjectService(IRepository<Subject> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SubjectDto>> GetAllSubjectsAsync()
    {
        var subjects = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<SubjectDto>>(subjects);
    }

    public async Task<SubjectDto?> GetSubjectByIdAsync(int id)
    {
        var subject = await _repository.GetByIdAsync(id);
        return subject == null ? null : _mapper.Map<SubjectDto>(subject);
    }

    public async Task<SubjectDto> CreateSubjectAsync(CreateSubjectDto createDto)
    {
        var subject = _mapper.Map<Subject>(createDto);
        var createdSubject = await _repository.AddAsync(subject);
        return _mapper.Map<SubjectDto>(createdSubject);
    }

    public async Task<SubjectDto> UpdateSubjectAsync(int id, UpdateSubjectDto updateDto)
    {
        var existingSubject = await _repository.GetByIdAsync(id);
        if (existingSubject == null)
        {
            throw new KeyNotFoundException($"Subject with id {id} not found");
        }

        _mapper.Map(updateDto, existingSubject);
        await _repository.UpdateAsync(existingSubject);
        return _mapper.Map<SubjectDto>(existingSubject);
    }

    public async Task<bool> DeleteSubjectAsync(int id)
    {
        var subject = await _repository.GetByIdAsync(id);
        if (subject == null)
        {
            return false;
        }

        await _repository.DeleteAsync(subject);
        return true;
    }

    public async Task<double> GetAverageGradeAsync()
    {
        var subjects = await _repository.GetAllAsync();
        var subjectsList = subjects.ToList();
        
        if (!subjectsList.Any())
        {
            return 0.0;
        }

        var average = subjectsList.Average(s => (int)s.Grade);
        return Math.Round(average, 2);
    }
}

