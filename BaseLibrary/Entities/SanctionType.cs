namespace BaseLibrary.Entities
{
    public class SanctionType : BaseEntity
    {
        // Many to one relationship with Vacation
        public Sanction? Sanction { get; set; }
    }
}
