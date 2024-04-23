import { Link } from "react-router-dom";
import "../styles/404.css";
export default function PageNotFound() {
  return (
    <div className="page-not-found-container">
      <div className="error-mid-container">
        <h4>404</h4>
        <p>We couldn't found this file on our server❌</p>
        <p>
          Did you came to this page, accidentally?? <br /> Simply⬇️
        </p>
        <Link to="/">
          <button>Goto Home</button>
        </Link>
      </div>
    </div>
  );
}
