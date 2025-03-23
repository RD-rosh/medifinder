const handleSignup = async (e) => {
    e.preventDefault();
  
    const userData = {
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
      pharmacy_name: e.target.pharmacy_name.value, 
      address: e.target.address.value,
      phone: e.target.phone.value,
      online_delivery: e.target.online_delivery.checked,
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  