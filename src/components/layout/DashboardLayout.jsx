import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "56px" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
