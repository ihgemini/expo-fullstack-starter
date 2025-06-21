import { ActivityIndicator, View } from "react-native";
import { useAuth } from "~/lib/auth-context";
import { Redirect } from "expo-router";
import LoginForm from "~/components/sign-in/login-form";

export default function SignInScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect href="/" />;
  }

  // Show login form
  return <LoginForm />;
}
