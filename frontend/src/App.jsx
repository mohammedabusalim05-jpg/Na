import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SideMenu from "./components/SideMenu";

// Main pages
import Homepage from "./pages/Homepage";
import Categorization from "./pages/Categorization";
import Profile from "./pages/Profile";
import RequestAid from "./pages/RequestAid";
import ApprovedAidCases from "./pages/ApprovedAidCases";
import SupportCase from "./pages/SupportCase";
import GeneralCategoryDonation from "./pages/GeneralCategoryDonation";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NGODashboard from "./pages/NGODashboard";
import ImpactHistory from "./pages/ImpactHistory";

// Admin pages
import VolunteerReview from "./pages/admin/VolunteerReview";

// Donation pages
import BloodDonation from "./pages/BloodDonation";
import OrganDonation from "./pages/OrganDonation";
import FinancialDonation from "./pages/FinancialDonation";
import FoodDonation from "./pages/FoodDonation";
import AdahiDonation from "./pages/AdahiDonation";
import ClothesDonation from "./pages/ClothesDonation";
import FurnitureDonation from "./pages/FurnitureDonation";
import MedicalEquipment from "./pages/MedicalEquipment";
import HouseholdDonation from "./pages/HouseholdDonation";
import WaterDonation from "./pages/WaterDonation";
import BabySupplies from "./pages/BabySupplies";
import ToysDonation from "./pages/ToysDonation";
import EducationSupport from "./pages/EducationSupport";
import ElectronicsDonation from "./pages/ElectronicsDonation";
import CleaningSupplies from "./pages/CleaningSupplies";
import MedicineSupport from "./pages/MedicineSupport";
import PetSupport from "./pages/PetSupport";
import VolunteerTime from "./pages/VolunteerTime";
import ProfessionalHelp from "./pages/ProfessionalHelp";
import FamilySupport from "./pages/FamilySupport";
import RefugeeSupport from "./pages/RefugeeSupport";
import OrphanSponsorship from "./pages/OrphanSponsorship";
import GeneralCharity from "./pages/GeneralCharity";
import FoodCoupons from "./pages/FoodCoupons";

// Auth pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyReset from "./pages/VerifyReset";
import ResetPassword from "./pages/ResetPassword";
import SignUp from "./pages/SignUp";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

// Dashboard pages
import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardHome from "./dashboard/DashboardHome";
import DonationsDashboard from "./dashboard/Donations";
import Users from "./dashboard/Users";
import Admins from "./dashboard/Admins";
import Stats from "./dashboard/Stats";
import DonationDetails from "./dashboard/DonationDetails";
import AidRequests from "./dashboard/AidRequests";

// Donation system pages
import Categories from "./pages/donations/Categories";
import CreateDonation from "./pages/donations/CreateDonation";
import DonationsByType from "./pages/donations/DonationsByType";

// User donations page
import Donations from "./pages/Donations";

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SideMenu />

      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/categorization" element={<Categorization />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/request-aid" element={<RequestAid />} />
        <Route path="/approved-aid" element={<ApprovedAidCases />} />
        <Route path="/support-case/:id" element={<SupportCase />} />
        <Route path="/general-donation/:type" element={<GeneralCategoryDonation />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/ngo-dashboard" element={<NGODashboard />} />
        <Route path="/history" element={<ImpactHistory />} />

        {/* Donation pages */}
        <Route path="/blood" element={<BloodDonation />} />
        <Route path="/organ" element={<OrganDonation />} />
        <Route path="/money" element={<FinancialDonation />} />
        <Route path="/food" element={<FoodDonation />} />
        <Route path="/adahi" element={<AdahiDonation />} />
        <Route path="/clothes" element={<ClothesDonation />} />
        <Route path="/furniture" element={<FurnitureDonation />} />
        <Route path="/medical" element={<MedicalEquipment />} />
        <Route path="/household" element={<HouseholdDonation />} />
        <Route path="/water" element={<WaterDonation />} />
        <Route path="/baby" element={<BabySupplies />} />
        <Route path="/toys" element={<ToysDonation />} />
        <Route path="/education" element={<EducationSupport />} />
        <Route path="/electronics" element={<ElectronicsDonation />} />
        <Route path="/cleaning" element={<CleaningSupplies />} />
        <Route path="/medicine-support" element={<MedicineSupport />} />
        <Route path="/pets" element={<PetSupport />} />
        <Route path="/volunteer" element={<VolunteerTime />} />
        <Route path="/skills" element={<ProfessionalHelp />} />
        <Route path="/families" element={<FamilySupport />} />
        <Route path="/refugees" element={<RefugeeSupport />} />
        <Route path="/orphans" element={<OrphanSponsorship />} />
        <Route path="/charity-general" element={<GeneralCharity />} />
        <Route path="/food-coupons" element={<FoodCoupons />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset" element={<VerifyReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin extra pages */}
        <Route path="/admin/volunteers" element={<VolunteerReview />} />

        {/* Donation system */}
        <Route path="/donations" element={<Categories />} />
        <Route path="/donations/:type" element={<DonationsByType />} />
        <Route path="/create-donation" element={<CreateDonation />} />

        {/* User donations */}
        <Route path="/all-donations" element={<Donations />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="donations" element={<DonationsDashboard />} />
          <Route path="aid-requests" element={<AidRequests />} />
          <Route path="users" element={<Users />} />
          <Route path="admins" element={<Admins />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Donation details */}
        <Route path="/admin/donations/:id" element={<DonationDetails />} />
        <Route path="/donations/:id" element={<DonationDetails />} />
      </Routes>
    </>
  );
}
