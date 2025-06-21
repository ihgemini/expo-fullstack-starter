import * as React from "react";
import { View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { Info } from "~/lib/icons/Info";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useAuth } from "~/lib/auth-context";
import { Redirect } from "expo-router";

export default function Screen() {
  const { user, signOut, isLoading } = useAuth();
  const [progress, setProgress] = React.useState(78);

  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100));
  }

  function handleSignOut() {
    signOut();
  }

  // If user is not logged in, redirect to sign-in
  if (!isLoading && !user) {
    return <Redirect href="/sign-in" />;
  }

  // If still loading, show loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
        <Text>Loading...</Text>
      </View>
    );
  }

  // Get user initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format user email domain for additional info
  const getEmailDomain = (email: string) => {
    return email.split("@")[1] || "";
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Card className="w-full max-w-sm p-6 rounded-2xl">
        <CardHeader className="items-center">
          <Avatar alt={`${user?.name}'s Avatar`} className="w-24 h-24">
            {user?.picture && <AvatarImage source={{ uri: user.picture }} />}
            <AvatarFallback>
              <Text>{user?.name ? getInitials(user.name) : "U"}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="p-3" />
          <CardTitle className="pb-2 text-center">
            {user?.name || "User"}
          </CardTitle>
          <View className="flex-row">
            <CardDescription className="text-base font-semibold">
              {user?.email_verified ? "Verified User" : "User"}
            </CardDescription>
            <Tooltip delayDuration={150}>
              <TooltipTrigger className="px-2 pb-0.5 active:opacity-50">
                <Info
                  size={14}
                  strokeWidth={2.5}
                  className="w-4 h-4 text-foreground/70"
                />
              </TooltipTrigger>
              <TooltipContent className="py-2 px-4 shadow">
                <Text className="native:text-lg">
                  {user?.provider
                    ? `Signed in via ${user.provider}`
                    : "Authenticated"}
                </Text>
              </TooltipContent>
            </Tooltip>
          </View>
        </CardHeader>
        <CardContent>
          <View className="flex-row justify-around gap-3">
            <View className="items-center">
              <Text className="text-sm text-muted-foreground">Email</Text>
              <Text
                className="text-lg font-semibold text-center"
                numberOfLines={2}
              >
                {user?.email?.split("@")[0] || "N/A"}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-muted-foreground">Domain</Text>
              <Text className="text-lg font-semibold">
                {user?.email ? getEmailDomain(user.email) : "N/A"}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-muted-foreground">Status</Text>
              <Text className="text-lg font-semibold">
                {user?.email_verified ? "✓" : "?"}
              </Text>
            </View>
          </View>
          <View className="pt-4">
            <Button
              variant="outline"
              className="w-full shadow shadow-foreground/5 border-destructive/20 web:hover:bg-destructive/5 active:bg-destructive/5"
              onPress={handleSignOut}
            >
              <Text className="text-destructive font-medium">Sign Out</Text>
            </Button>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-3 pb-0">
          <View className="flex-row items-center overflow-hidden">
            <Text className="text-sm text-muted-foreground">Productivity:</Text>
            <LayoutAnimationConfig skipEntering>
              <Animated.View
                key={progress}
                entering={FadeInUp}
                exiting={FadeOutDown}
                className="w-11 items-center"
              >
                <Text className="text-sm font-bold text-sky-600">
                  {progress}%
                </Text>
              </Animated.View>
            </LayoutAnimationConfig>
          </View>
          <Progress
            value={progress}
            className="h-2"
            indicatorClassName="bg-sky-600"
          />
          <View />
          <Button
            variant="outline"
            className="shadow shadow-foreground/5"
            onPress={updateProgressValue}
          >
            <Text>Update</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
