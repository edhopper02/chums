// Username selection

// Check if there's a Supabase access token in the URL
window.addEventListener("DOMContentLoaded", async () => {
  const hash = window.location.hash;

  if (hash && hash.includes("access_token")) {
    // Parse and store the session from the URL
    const { data, error } = await supabase.auth.exchangeCodeForSession({ redirectTo: window.location.origin });

    if (error) {
      console.error("Error setting session from URL:", error.message);
    } else {
      console.log("Session restored from URL:", data);
    }

    // Clean up the URL (remove hash parameters)
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

document.getElementById("username-form").addEventListener("submit", async (e) => {
    console.log("Submit event triggered!");
    e.preventDefault();
    
    const username = document.getElementById("change-username").value;
    
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
    }

    let { data: inputData, error: inputError } = await supabase
    .from('userDetails')
    .insert([{ user_id: userData.user.id, sUsername: username, sEmail: userData.user.email }])

    if (inputError) {
        console.error("Error inserting data:", inputError.message);
        alert("Error:", inputError.message);
    } else {
        console.log("Username added successfully:", inputData);
        alert("Success!");
    }
})
