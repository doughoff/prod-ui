import React from "react";
import { useNavigate } from "react-router-dom";

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      navigate("/app");
    }
    if (!sessionID) {
      navigate("/login");
    }
  }, []);
  return <div></div>;
};

export default IndexPage;
