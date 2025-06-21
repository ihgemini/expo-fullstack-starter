import { View, Pressable } from "react-native";
import { useAuth } from "~/lib/auth-context";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";

export function HeaderActions() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  // Only show logout button if user is authenticated
  if (!user) {
    return <ThemeToggle />;
  }

  return (
    <View className="flex-row items-center gap-2">
      <Pressable
        onPress={handleSignOut}
        className="px-3 py-1.5 rounded-md bg-destructive/10 active:bg-destructive/20 web:hover:bg-destructive/15"
      >
        <Text className="text-destructive font-medium text-sm">Logout</Text>
      </Pressable>
      <ThemeToggle />
    </View>
  );
}
