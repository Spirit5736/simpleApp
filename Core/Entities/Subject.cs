using Core.Enums;

namespace Core.Entities;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public Grade Grade { get; set; }
}

