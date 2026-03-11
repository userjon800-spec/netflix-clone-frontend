export const navUtil = [
  { title: "Upcoming", menu: "/upcoming" },
  { title: "Action", menu: "/action" },
  { title: "Comedy", menu: "/comedy" },
  { title: "Horror", menu: "/horror" },
  { title: "Animation", menu: "/animation" },
];
export const faqs = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer:
      "Go to Profile → Security → Reset Password. From there, enter the 6-digit number that you remember and after resetting the password, log out of the account. In the Sign in section, click on Need help and from there click on reset password. Enter your email and 6-digit number and you will set a new password. Confirm the password and return to the sign in section and log in with that password.",
    category: "account",
  },
  {
    id: 2,
    question: "How do I save movies to my list?",
    answer:
      "Click the bookmark icon on any movie poster to save it. You can find saved movies in your Profile → Saved Movies.",
    category: "movies",
  },
  {
    id: 3,
    question: "How does the like feature work?",
    answer:
      "Click the heart icon on movies you enjoy. Liked movies appear in your Profile → Liked Movies section.",
    category: "movies",
  },
  {
    id: 4,
    question: "Can I change my email address?",
    answer:
      "Yes, go to Profile → Edit Profile and update your email address there.",
    category: "account",
  },
  {
    id: 5,
    question: "How do I update my profile picture?",
    answer:
      "Click on the camera icon on your profile avatar and upload a new image.",
    category: "account",
  },
  {
    id: 6,
    question: "Is my payment information secure?",
    answer:
      "Yes, we use industry-standard encryption to protect your data. We never store your full payment details.",
    category: "security",
  },
  {
    id: 7,
    question: "How do I report a problem with a movie?",
    answer:
      "Use the feedback form below or contact us directly at userjon800@gmail.com. We appreciate your feedback and will address any issues promptly.",
    category: "technical",
  },
  {
    id: 8,
    question: "Can I watch movies offline?",
    answer:
      "Currently, offline viewing is not available. We're working on adding this feature in the future.",
    category: "technical",
  },
];
export const description = [
  { title: "User Reviews", desc: "Rate and review movies" },
  { title: "Watchlist Sync", desc: "Sync across devices" },
  { title: "Recommendations", desc: "AI-powered suggestions" },
  { title: "Offline Mode", desc: "Download to watch later" },
  { title: "Friends Activity", desc: "See what friends watch" },
  { title: "Dark/Light Theme", desc: "Choose your preference" },
];
export const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY_API as string;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
