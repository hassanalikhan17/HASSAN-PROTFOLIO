# Email Notification Setup Guide

## How to Receive Emails When Someone Submits the Contact Form

Your portfolio contact form is set up to send emails to your inbox. Follow these steps to activate it:

### Option 1: Using Formspree.io (Recommended - Free)

1. **Go to Formspree.io**
   - Visit: https://formspree.io

2. **Sign Up or Log In**
   - Create a free account with your email (hassanjaddon@gmail.com)

3. **Create a New Form**
   - Click "New Form"
   - Enter your email address
   - Accept the terms and create the form

4. **Get Your Form ID**
   - After creation, you'll get a Form ID like: `mpwqvonj`
   - Copy this ID

5. **Update Your Portfolio**
   - Open `index.html` in a text editor
   - Find this line (around line 407):
     ```html
     <form class="contact-form" id="contactForm" action="https://formspree.io/f/mpwqvonj" method="POST" novalidate>
     ```
   - Replace `mpwqvonj` with your actual Form ID:
     ```html
     <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID_HERE" method="POST" novalidate>
     ```

6. **Verify**
   - Go back to Formspree.io
   - You should see a prompt to verify your email
   - Click the verification link in the email Formspree sends you

7. **Test It**
   - Fill out the contact form on your portfolio
   - Submit it
   - You should receive an email at hassanjaddon@gmail.com with the message details

### Option 2: Using Netlify Forms (If You Deploy to Netlify)

If you're deploying your portfolio to Netlify:
1. Connect your repository to Netlify
2. Netlify automatically detects forms with `netlify` attribute
3. Add `netlify` to your form tag
4. Emails will be sent to your account email automatically

### Form Fields Included

When someone submits the form, you'll receive:
- **Name**: Visitor's full name
- **Email**: Visitor's email address
- **Phone**: Visitor's phone (optional)
- **Subject**: What they're contacting about
- **Message**: Their full message

### Email Notification Example

Subject: Contact Form Submission

```
From: John Doe (john@example.com)
Phone: +92-321-1234567

Subject: Job Opportunity at TechCorp

Message:
Hi Hassan, we have an exciting full-stack developer position at our company...
```

### SMS Notifications (Optional Enhancement)

To also receive SMS notifications:

1. **Using Twilio** (paid service):
   - Sign up at https://www.twilio.com
   - Create a webhook to send SMS to 03335217746
   - This would require a backend service

2. **Using EmailJS** (free alternative):
   - Set up a forwarding rule to get notifications on your phone
   - Or use email-to-SMS (your carrier likely supports this)

### Troubleshooting

**Not receiving emails?**
- Check your Formspree email verification
- Check spam/trash folders
- Make sure you're using the correct Form ID
- Test by submitting a form and checking Formspree dashboard

**Form not submitting?**
- Clear browser cache
- Check browser console for errors (F12)
- Make sure your internet connection is stable

### Security Notes

- Formspree requires email verification for security
- Your email won't be shared publicly
- No payment information is needed for the free tier
- Formspree free tier is limited to 50 submissions per month
- Upgrade to pro for unlimited submissions if needed

---

**Questions?** Reach out to Hassan at hassanjaddon@gmail.com
