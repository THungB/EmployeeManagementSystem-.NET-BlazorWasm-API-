using System.Text.Json.Serialization;

namespace BaseLibrary.Entities
{
    public class VacationType : BaseEntity
    {
        // Many to one relationship with Vacation
        [JsonIgnore]
        public Vacation? Vacation { get; set; }
    }
}
