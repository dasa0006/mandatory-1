import { Stack } from "expo-router";

export default function NoteLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="[slug]"
				options={{
					title: "", // Empty title – no text shown
					headerBackTitle: "", // Removes the back label on iOS (optional)
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
