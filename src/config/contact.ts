// Contact configuration
// Modify these values to update contact information across the site

export const CONTACT_CONFIG = {
  // Email address
  email: 'remibo@kth.se',

  // Coffee chat email template
  coffeeChat: {
    subject: 'A spontaneous coffee chat',
    body: `Hi Rémi,

I am [briefly introduce yourself]

I came across your website and would love to grab a (virtual) coffee to chat about [a topic] .

I'm particularly interested in [mention topic here].

Would you be available for a 30-minute chat sometime in the next few weeks?

Looking forward to connecting!

Best,
[Your name]`
  }
};

// Helper function to generate mailto link
export const getCoffeeChatMailto = () => {
  const { email, coffeeChat } = CONTACT_CONFIG;
  const subject = encodeURIComponent(coffeeChat.subject);
  const body = encodeURIComponent(coffeeChat.body);
  return `mailto:${email}?subject=${subject}&body=${body}`;
};
