import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Top({
  title,
  payload,
  isProfile,
  widthOfWindow,
}: {
  title?: string;
  payload?: string;
  isProfile?: boolean;
  widthOfWindow?: number;
}) {
  const navigate = useNavigate();
  const navigateBack = () => {
    isProfile && widthOfWindow && widthOfWindow < 1010
      ? navigate("/profile")
      : navigate(-1);
  };
  return (
    <div className="back-sign">
      <BiArrowBack onClick={navigateBack} />
      <div className="account-details">
        <p>{title}</p>
        <p>{payload}</p>
      </div>
    </div>
  );
}
