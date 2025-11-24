using Core.Enums;

namespace Application.DTOs;

public class SubjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public Grade Grade { get; set; }
}

