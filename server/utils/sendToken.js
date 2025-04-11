export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const payload = { name: user.name, email: user.email, role: user.role };

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      token,
      user: payload,
      message,
    });
};
