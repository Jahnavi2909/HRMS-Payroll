import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const PayrollLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
};

export default PayrollLayout;
