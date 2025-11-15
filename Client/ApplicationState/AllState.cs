namespace Client.ApplicationStates
{
    public enum ViewType
    {
        None,
        GeneralDepartment,
        Department,
        Branch,
        Country,
        City,
        Town,
        User,
        Employee,
        Vacation,
        Overtime,
        Doctor,
        Sanction
    }

    public class AllState
    {
        // Scope action - expose as an event so components can subscribe/unsubscribe using += and -=
        public event Action? Action;

        // Current view state
        public ViewType CurrentView { get; private set; } = ViewType.None;

        // Convenience properties for view checks used in Razor components
        public bool ShowGeneralDepartment => CurrentView == ViewType.GeneralDepartment;
        public bool ShowDepartment => CurrentView == ViewType.Department;
        public bool ShowBranch => CurrentView == ViewType.Branch;
        public bool ShowCountry => CurrentView == ViewType.Country;
        public bool ShowCity => CurrentView == ViewType.City;
        public bool ShowTown => CurrentView == ViewType.Town;
        public bool ShowUser => CurrentView == ViewType.User;
        public bool ShowEmployee => CurrentView == ViewType.Employee;
        public bool ShowVacation => CurrentView == ViewType.Vacation;
        public bool ShowOvertime => CurrentView == ViewType.Overtime;
        public bool ShowDoctor => CurrentView == ViewType.Doctor;
        public bool ShowSanction => CurrentView == ViewType.Sanction;

        // General Department
        public void GeneralDepartmentClicked()
        {
            CurrentView = ViewType.GeneralDepartment;
            Action?.Invoke();
        }

        // Department
        public void DepartmentClicked()
        {
            CurrentView = ViewType.Department;
            Action?.Invoke();
        }

        // Branch
        public void BranchClicked()
        {
            CurrentView = ViewType.Branch;
            Action?.Invoke();
        }

        // Country
        public void CountryClicked()
        {
            CurrentView = ViewType.Country;
            Action?.Invoke();
        }

        // City
        public void CityClicked()
        {
            CurrentView = ViewType.City;
            Action?.Invoke();
        }

        // Town
        public void TownClicked()
        {
            CurrentView = ViewType.Town;
            Action?.Invoke();
        }

        // User
        public void UserClicked()
        {
            CurrentView = ViewType.User;
            Action?.Invoke();
        }

        // Employee
        public void EmployeeClicked()
        {
            CurrentView = ViewType.Employee;
            Action?.Invoke();
        }

        // Vacation
        public void VacationClicked()
        {
            CurrentView = ViewType.Vacation;
            Action?.Invoke();
        }

        // Overtime
        public void OvertimeClicked()
        {
            CurrentView = ViewType.Overtime;
            Action?.Invoke();
        }

        // Doctor
        public void DoctorClicked()
        {
            CurrentView = ViewType.Doctor;
            Action?.Invoke();
        }

        // Sanction
        public void SanctionClicked()
        {
            CurrentView = ViewType.Sanction;
            Action?.Invoke();
        }
    }
}
