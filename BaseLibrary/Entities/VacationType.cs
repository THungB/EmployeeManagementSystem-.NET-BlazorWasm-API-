namespace BaseLibrary.Entities
{
    public class VacationType : BaseEntity
    {
        // Many to one relationship with Vacation
        public Vacation? Vacation { get; set; }
    }
}
