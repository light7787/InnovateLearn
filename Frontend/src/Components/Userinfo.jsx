import React, { useState, useEffect } from "react";

const Userinfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the email of the logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedEmail = storedUser ? storedUser.email : null;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Find the specific user matching the stored email
        const matchingUser = data.find((user) => user.email === storedEmail);

        if (matchingUser) {
          setUserInfo(matchingUser);
        } else {
          setError("No matching user found.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [storedEmail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="userinfo bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">User Badges</h2>
      {userInfo && userInfo.badges ? (
        <div>
          <ul className="list-disc list-inside">
            {userInfo.badges.length > 0 ? (
              userInfo.badges.map((badge, index) => (
                <li key={index} className="text-gray-700">
                  {badge}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No badges earned.</li>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-lg text-gray-700">No badges available.</p>
      )}
    </div>
  );
};

export default Userinfo;
