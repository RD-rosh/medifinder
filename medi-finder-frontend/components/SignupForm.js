<form onSubmit={handleSignup}>
  <input type="text" name="username" placeholder="Username" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Password" required />
  <input type="text" name="pharmacy_name" placeholder="Pharmacy Name (Optional)" />
  <input type="text" name="address" placeholder="Address" />
  <input type="text" name="phone" placeholder="Phone" />
  <label>
    Online Delivery:
    <input type="checkbox" name="online_delivery" />
  </label>
  <button type="submit">Sign Up</button>
</form>
