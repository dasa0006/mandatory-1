import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ title: "", headerShown: false }} />
			<Stack.Screen name="note" options={{ title:"", headerShown: true }} />
		</Stack>
	);
}
