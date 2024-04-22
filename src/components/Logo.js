import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Logo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    setEnable(pathname.indexOf("/app/") === -1);
  }, [pathname]);

  const handleBackHome = () => {
    if (enable) navigate("/app");
  };

  return (
    <header className={"header " + (enable ? "enable" : "")} onClick={handleBackHome}>
      <h1>ExpensesTracker</h1>
      <h6>— Keep your expenses in order —</h6>
    </header>
  );
};

export default Logo;
