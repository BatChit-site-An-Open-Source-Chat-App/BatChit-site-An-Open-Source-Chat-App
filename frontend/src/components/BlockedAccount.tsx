import Top from "../sub-components/Top";
import "../styles/blocked-account.css";
export default function BlockedAccount() {
  return (
    <div className="blocked-accounts-container">
      <div className="top-header user-info-header">
        <Top title="Blocked Accounts" />
      </div>
      <div className="blocked-accounts">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 11].map((e) => (
          <div key={e} className="blocked-account">
            <div className="blocked-header-content">
              <div className="blocked-user-profile">
                <div className="blocked-user-profile-img">
                  <img src="/user1.jpg" alt="" />
                </div>
                <div>
                  <div className="blocked-user-name">
                    <p>Niraj Chaurasiya</p>
                    <p style={{ wordBreak: "break-all" }}>
                      nirajkumarchaurasiya@gmail.com
                    </p>
                  </div>
                  <div className="blocked-date">
                    <p>
                      <span>Blocked On:</span> Aug 22 2022
                    </p>
                  </div>
                </div>
              </div>
              <div className="blocked-button">
                <button></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
