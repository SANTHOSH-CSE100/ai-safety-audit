import { Tabs } from "expo-router";
import { LayoutDashboard, Building2, Upload, FileText, BarChart3 } from "lucide-react-native";
import { AuthGate } from "../../providers/AuthGate";
import { colors } from "../../theme";

export default function AppLayout() {
  return (
    <AuthGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary.DEFAULT,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            borderTopColor: colors.border,
            height: 64,
            paddingTop: 8,
            paddingBottom: 10,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{ title: "Dashboard", tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="factories"
          options={{ title: "Factories", tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="upload"
          options={{ title: "Upload", tabBarIcon: ({ color, size }) => <Upload color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="reports"
          options={{ title: "Reports", tabBarIcon: ({ color, size }) => <FileText color={color} size={size} /> }}
        />
        <Tabs.Screen
          name="analytics"
          options={{ title: "Analytics", tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} /> }}
        />
        {/* Reachable via header icons, not the tab bar — hidden here to keep the bar to 5 items */}
        <Tabs.Screen name="notifications" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>
    </AuthGate>
  );
}
