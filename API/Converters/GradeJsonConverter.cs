using System.Text.Json;
using System.Text.Json.Serialization;
using Core.Enums;

namespace API.Converters;

public class GradeJsonConverter : JsonConverter<Grade>
{
    public override Grade Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var value = reader.GetInt32();
            if (Enum.IsDefined(typeof(Grade), value))
            {
                return (Grade)value;
            }
            throw new JsonException($"Invalid grade value: {value}. Grade must be between 1 and 5.");
        }
        
        if (reader.TokenType == JsonTokenType.String)
        {
            var stringValue = reader.GetString();
            if (int.TryParse(stringValue, out var intValue) && Enum.IsDefined(typeof(Grade), intValue))
            {
                return (Grade)intValue;
            }
            if (Enum.TryParse<Grade>(stringValue, true, out var enumValue))
            {
                return enumValue;
            }
            throw new JsonException($"Invalid grade value: {stringValue}.");
        }

        throw new JsonException($"Unexpected token type: {reader.TokenType}");
    }

    public override void Write(Utf8JsonWriter writer, Grade value, JsonSerializerOptions options)
    {
        writer.WriteNumberValue((int)value);
    }
}

