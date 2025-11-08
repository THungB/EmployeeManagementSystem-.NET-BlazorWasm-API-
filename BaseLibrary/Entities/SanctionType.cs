using System.Text.Json.Serialization;

namespace BaseLibrary.Entities
{
    public class SanctionType : BaseEntity
    {
        // Many to one relationship with Vacation
        [JsonIgnore]
        public Sanction? Sanction { get; set; }
    }
}
