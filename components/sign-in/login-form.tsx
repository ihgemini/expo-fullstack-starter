import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "~/lib/auth-context";
import { Google } from "~/lib/icons/Google";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function LoginForm() {
  const { signIn, isLoading } = useAuth();

  function handleSignIn() {
    console.log("Signing in...");
    signIn();
  }

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <CardHeader className="items-center">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Google className="w-10 h-10" />
          </View>
          <CardTitle className="pb-2 text-center text-2xl">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>{" "}
        <CardContent className="pt-6">
          <Button
            className="w-full shadow shadow-foreground/5"
            variant="outline"
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center gap-3">
                <ActivityIndicator size="small" />
                <Text className="text-foreground">Signing in...</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-3">
                <Google className="w-5 h-5" />
                <Text className="text-foreground font-medium">
                  Continue with Google
                </Text>
              </View>
            )}
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
