import { useLocation, useNavigate } from "react-router-dom";
import Hover from "./Hover";
import Button from "./Button";
import { useDebugContext } from "../contexts/DebugContext";

const Logo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { admin } = useDebugContext();

  const enableBackHome = pathname.indexOf("/app/") === -1;
  const enableBuyMeACafeHome = pathname.indexOf("/buyMeACafe") === -1;
  const enableAboutHome = pathname.indexOf("/about") === -1;

  const handleBackHome = (e) => {
    e.preventDefault();
    if (enableBackHome) navigate("/app");
  };

  const handleBuyMeACafeHome = (e) => {
    e.preventDefault();
    if (enableBuyMeACafeHome) navigate("/buyMeACafe");
  };

  const handleAboutHome = (e) => {
    e.preventDefault();
    if (enableAboutHome) navigate("/about");
  };

  return (
    <header className={`header ${enableBackHome ? "enable" : ""}`}>
      <div onClick={handleBackHome}>
        <h1>ExpensesTracker</h1>
        <h6>— Keep your expenses in order —</h6>
      </div>
      <div className={"floatingBanner"}>
        {false && (
          <Hover visible={enableAboutHome} caption={"All you want to know about me..."}>
            <Button className={`button-shadow button-big ${!enableAboutHome ? "selected" : ""}`} onClick={handleAboutHome} disabled={!enableAboutHome}>
              😀
            </Button>
          </Hover>
        )}
        <Hover visible={enableBuyMeACafeHome} caption={"Would you like to buy me a café ?"}>
          <Button className={`button-shadow button-big ${!enableBuyMeACafeHome ? "selected" : ""}`} onClick={handleBuyMeACafeHome} disabled={!enableBuyMeACafeHome}>
            ☕️
          </Button>
        </Hover>
      </div>
    </header>
  );
};

export default Logo;
