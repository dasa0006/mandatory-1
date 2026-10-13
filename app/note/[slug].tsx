import { db } from "@/firebase";
import { useLocalSearchParams } from "expo-router";
import { linkTo } from "expo-router/build/global-state/routing";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Map from "../(tabs)/map";

export default function Note() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	const [values, loading, error] = useCollection(collection(db, "notes"));
	const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

	const [noteMetaData, setNoteMetaData] = useState();
	const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
	const [isSetLocationModalVisible, setSetLocationModalVisible] =
		useState(false);

	// --- State for input values ---
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");

	async function handleSaveUpdateNote() {
		// Now we can safely use the state values
		await updateDoc(doc(db, "notes", noteMetaData?.id), {
			title: title || "",
			text: text || "",
		});
	}

	async function handleDeleteNote() {
		// TODO: implement delete note from db
		await deleteDoc(doc(db, "notes", noteMetaData?.id));
		// After db ops delete note, redirect to home/index
		linkTo({
			pathname: "/",
		});
	}

	function handleSaveAndClose() {
		handleSaveUpdateNote();
		setSettingsModalVisible(false);
		alert("Note saved!");
	}

	async function handleDeleteAndClose() {
		await handleDeleteNote();
		setSettingsModalVisible(false);
		alert("Note deleted!");
	}

	function handleSetLocation() {
		setSettingsModalVisible(false);
		setSetLocationModalVisible(true);
	}

	// Load note data when it becomes available
	useEffect(() => {
		if (data && slug) {
			const note = data.find((item) => item.id === slug);
			setNoteMetaData(note);
			if (note) {
				setTitle(note.title || "");
				setText(note.text || "");
			}
		}
		if (error) alert(error);
	}, [loading, slug]); // Added dependencies

	return (
		<View style={{ width: "100%" }}>
			<TouchableOpacity
				style={styles.settingsButton}
				onPress={() => setSettingsModalVisible(true)}
				accessibilityLabel="Settings"
			>
				<Text style={styles.settingsButtonText}>⚙️</Text>
			</TouchableOpacity>

			<TextInput
				placeholder="Title"
				style={{
					height: 75,
					width: "100%",
					backgroundColor: "gray",
					fontSize: 55,
					paddingInline: 20,
				}}
				value={title}
				onChangeText={setTitle}
			></TextInput>
			<TextInput
				placeholder="Note content"
				multiline
				style={{
					height: 300,
					width: "100%",
					backgroundColor: "#f5f5f5",
					fontSize: 20,
					padding: 20,
					textAlignVertical: "top",
				}}
				value={text}
				onChangeText={setText}
			></TextInput>

			<Modal
				animationType="slide"
				transparent={false}
				visible={isSettingsModalVisible}
				onRequestClose={() => setSettingsModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Settings</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setSettingsModalVisible(false)}
						>
							<Text style={styles.closeButtonText}>✕</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.modalOptions}>
						{/* LOCATION */}
						<TouchableOpacity
							style={styles.modalOption}
							onPress={handleSetLocation}
						>
							<Text style={styles.modalOptionText}>Set Location</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.modalOption}
							onPress={handleSaveAndClose}
						>
							<Text style={styles.modalOptionText}>💾 Save Note</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.modalOption, styles.deleteOption]}
							onPress={handleDeleteAndClose}
						>
							<Text style={[styles.modalOptionText, styles.deleteOptionText]}>
								🗑️ Delete Note
							</Text>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.cancelButton}
						onPress={() => setSettingsModalVisible(false)}
					>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
				animationType="slide"
				transparent={false}
				visible={isSetLocationModalVisible}
				onRequestClose={() => setSetLocationModalVisible(false)}
			>
				<Map
					isModal
					noteProps={noteMetaData}
					setSetLocationModalVisible={setSetLocationModalVisible}
				/>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flex: 1,
		position: "relative",
	},
	settingsButton: {
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 10,
		padding: 10,
		backgroundColor: "rgba(0,0,0,0.1)",
		borderRadius: 20,
	},
	settingsButtonText: {
		fontSize: 24,
	},
	titleInput: {
		height: 75,
		width: "100%",
		backgroundColor: "gray",
		fontSize: 55,
		paddingInline: 20,
	},
	contentInput: {
		height: 300,
		width: "100%",
		backgroundColor: "#f5f5f5",
		fontSize: 20,
		padding: 20,
		textAlignVertical: "top",
	},
	modalContainer: {
		flex: 1,
		backgroundColor: "white",
		padding: 20,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
	},
	closeButton: {
		padding: 10,
	},
	closeButtonText: {
		fontSize: 24,
	},
	modalOptions: {
		marginBottom: 20,
	},
	modalOption: {
		padding: 20,
		marginVertical: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		alignItems: "center",
	},
	deleteOption: {
		backgroundColor: "#ffe0e0",
	},
	modalOptionText: {
		fontSize: 18,
	},
	deleteOptionText: {
		color: "red",
	},
	cancelButton: {
		padding: 15,
		backgroundColor: "#e0e0e0",
		borderRadius: 10,
		alignItems: "center",
	},
	cancelButtonText: {
		fontSize: 18,
	},
});
