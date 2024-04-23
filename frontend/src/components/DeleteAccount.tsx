import Top from "../sub-components/Top";
import "../styles/delete-account.css";
export default function DeleteAccount() {
  return (
    <div className="delete-account-container">
      <div className="top-header user-info-header">
        <Top title="Delete Account" />
      </div>
      <div className="delete-account">
        <p>Are you sure, you want to delete your account?</p>
        <span>
          Remember, the process is irreversible which means once you delete your
          <br />
          account, you will not be able to access it.
        </span>
        <button>Proceed</button>
      </div>
    </div>
  );
}
