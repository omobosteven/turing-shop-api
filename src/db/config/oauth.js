import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import CustomerSocialAuthController from '../../controllers/CustomerSocialAuthController';


passport.serializeUser(((user, done) => {
  done(null, user.name);
}));
passport.deserializeUser(((user, done) => {
  done(null, user);
}));

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email']
  }, CustomerSocialAuthController.passportCallback)
);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, CustomerSocialAuthController.passportCallback));

export default passport;
