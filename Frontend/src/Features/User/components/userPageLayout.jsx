import Navbar from "../../Movies/components/Navbar";
import "../styles/userLayout.scss";

const UserPageLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-layout__main">
        {children}
      </main>
    </div>
  );
};

export default UserPageLayout;