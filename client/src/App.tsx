import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./components/routes/PrivateRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import { useIdleLogout } from "./hooks/useIdleLogout";
import RoleBasedRoute from "./components/routes/RoleBasedRoute";
import CreateRole from "./pages/AuthPages/CreateRole";
import SignUp from "./pages/AuthPages/SignUp";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NewPassword from "./pages/AuthPages/NewPassword";
import Contract from "./pages/Contract";
import ChooseContractTables from "./pages/Tables/ChooseContractTables";
import ComingSoon from "./pages/OtherPage/ComingSoon";
import EditProfile from "./pages/AuthPages/EditProfile";
import CreateDataUser from "./pages/AuthPages/CreateDataUser";
import EditDataUser from "./pages/AuthPages/EditDataUser";
import EditRole from "./pages/AuthPages/EditRole";
import CreatePackage from "./pages/Package/CreatePackage";
import ChooseSaleTables from "./pages/Tables/ChooseSaleTables";
import PayServiceFormExample from "./pages/Forms/SellServiceFormExample";
import NotificationsTables from "./pages/Tables/NotificationsTables";
import PaymentsTables from "./pages/Tables/PaymentsTables";
import InvoicePage from "./pages/Invoice/InvoicePage";
import RepairForm from "./pages/Forms/RepairForm";
import BalanceTopUp from "./pages/AuthPages/BalanceTopUp";
import ChooseAddBalanceTables from "./pages/Tables/ChooseAddBalanceTables";
import BalanceDashboard from "./components/auth/BalanceDashboard";
import RestrictedRoute from "./components/routes/RestrictedRoute";
import AboutPage from "./pages/AboutPage";
import AcceptCall from "./pages/Forms/Call/CallAccept";
import { HelmetProvider } from "react-helmet-async";
import TitleUpdater from "./components/routes/TitleUpdater";
import Roles from "./pages/AuthPages/Roles";
import Packages from "./pages/AuthPages/Packages";
import Calls from "./pages/AuthPages/Calls";
import Repairs from "./pages/AuthPages/Repairs";
import ContractsPageMeta from "./pages/AuthPages/ContractsPageMeta";
import CreateContractPageMeta from "./pages/AuthPages/CreateContractPageMeta";
import CallType from "./pages/AuthPages/CallType";
import UserProfile from "./pages/UserProfile";
import UpdateContract from "./pages/AuthPages/UpdateContract";
import Payment from "./pages/AuthPages/Payment";
import PaymentComplete from "./pages/AuthPages/PaymentComplete";
import NonSubscriber from "./pages/AuthPages/NonSubscriber";
import Subscriber from "./pages/AuthPages/Subscriber";
import EditPackage from "./pages/Package/EditPackage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResourceList from "./components/wialon/ResourceList";

function RoleBasedRedirect() {
  const user = localStorage.getItem("role"); // user rolu burada olmalıdır: user?.role
  console.log(user);

  if (user == "abuneci") {
    return <Navigate to="/balance" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

const AppRoutes = () => {
  const { token, setToken } = useContext(AuthContext);

  useIdleLogout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setToken(null);
  }, 10 * 60 * 1000);

  return (
    <>
      <Router>
        <TitleUpdater />
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          aria-label={"aa"}
          style={{ zIndex: "111111" }}
        />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <PrivateRoute token={token}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route
              index
              path="/dashboard"
              element={
                <RestrictedRoute
                  blockedRoles={["abuneci"]}
                  redirectTo="/balance"
                >
                  <Home />
                </RestrictedRoute>
              }
            />
            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
            <Route path="/" element={<RoleBasedRedirect />} />
            {/* gpsbaku.az Page */}
            <Route path="/list" element={<ResourceList />} />
            {/* <Route path="/list/edit/:role/:id" element={<EditUser />} /> */}
            <Route path="/list/edit/:role/:id" element={<EditDataUser />} />
            <Route path="/list/create" element={<CreateDataUser />} />
            <Route path="/list/user/:id" element={<UserProfiles />} />

            <Route path="/create-package" element={<CreatePackage />} />
            <Route path="/edit-package/:id" element={<EditPackage />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/repairs" element={<Repairs />} />

            <Route path="/call" element={<CallType />} />
            <Route path="/call/non-subscriber" element={<NonSubscriber />} />
            <Route path="/call/subscriber" element={<Subscriber />} />

            {/* <Route
              path="/call"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <CallTypeSelector />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/call/non-subscriber"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <NonSubscriberCallForm />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/call/subscriber"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <SubscriberCallForm />
                </RoleBasedRoute>
              }
            /> */}
            <Route
              path="/roles"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Roles />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/create-role"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <CreateRole />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/edit-role/:roleId"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <EditRole />
                </RoleBasedRoute>
              }
            />
            {/* Others Page */}

            <Route path="/PayServiceForm" element={<PayServiceFormExample />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/edit-profile/:id" element={<EditProfile />} />
            <Route path="/contract/:id" element={<Contract />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route
              path="/create-contract/:subsId"
              element={<CreateContractPageMeta />}
            />
            <Route path="/create-contract" element={<ChooseContractTables />} />
            <Route path="/create-sale" element={<ChooseSaleTables />} />
            <Route path="/sales" element={<PaymentsTables />} />
            <Route path="/sale-table/:id" element={<Payment />} />
            <Route path="/payments/new" element={<PaymentComplete />} />
            <Route path="/invoice/:id" element={<InvoicePage />} />
            <Route path="/add-balance/:id" element={<BalanceTopUp />} />
            <Route path="/add-balance" element={<ChooseAddBalanceTables />} />
            <Route path="/balance" element={<BalanceDashboard />} />
            <Route
              path="/edit-contract/:contractId"
              element={<UpdateContract />}
            />
            <Route path="/contracts" element={<ContractsPageMeta />} />
            <Route path="/notifications" element={<NotificationsTables />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/repair/:callId" element={<RepairForm />} />

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/call/accept/:callId/:techId" element={<AcceptCall />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<NewPassword />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
