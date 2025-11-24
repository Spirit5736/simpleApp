using Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class UpdateSubjectDto
{
    [Required(ErrorMessage = "Subject name is required")]
    [StringLength(200, ErrorMessage = "Subject name cannot exceed 200 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Exam date is required")]
    public DateTime ExamDate { get; set; }

    [Required(ErrorMessage = "Grade is required")]
    [Range(1, 5, ErrorMessage = "Grade must be between 1 and 5")]
    public Grade Grade { get; set; }
}

